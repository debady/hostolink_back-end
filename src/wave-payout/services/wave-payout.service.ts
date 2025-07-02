import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { WavePayoutSession } from '../entities/wave-payout-session.entity';
import { UserEtablissementSante } from '../../user_etablissement_sante/entities/user-etablissement-sante.entity';
import { Otp } from '../../utilisateur/entities/otp.entity';
import { CreatePayoutDto } from '../dto/wave-payout.dto';
import { WaveEmailService } from './wave-email.service';
import { v4 as uuidv4 } from 'uuid';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WavePayoutService {
  constructor(
    @InjectRepository(WavePayoutSession)
    private payoutRepository: Repository<WavePayoutSession>,
    
    @InjectRepository(UserEtablissementSante)
    private etablissementRepository: Repository<UserEtablissementSante>,
    
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
    
    private httpService: HttpService,
    private dataSource: DataSource,
    private waveEmailService: WaveEmailService
  ) {}

  // 🚀 Créer un retrait Wave
  async createPayout(etablissementId: number, dto: CreatePayoutDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // ✅ 1. Vérifier l'établissement
      const etablissement = await this.etablissementRepository.findOne({
        where: { id_user_etablissement_sante: etablissementId }
      });

      if (!etablissement) {
        throw new HttpException('Établissement non trouvé', HttpStatus.NOT_FOUND);
      }

      // ✅ 2. Vérifier le numéro Wave
      if (!etablissement.numero_wave) {
        throw new HttpException('Numéro Wave non configuré', HttpStatus.BAD_REQUEST);
      }

      if (!etablissement.wave_verified) {
        throw new HttpException('Compte Wave non vérifié', HttpStatus.BAD_REQUEST);
      }

      // ✅ 3. Vérifier le solde
      const soldeResult = await queryRunner.query(`
        SELECT solde_compte, limite_retrait_journalier, retrait_mensuel_cumule
        FROM compte 
        WHERE id_user_etablissement_sante = $1 AND type_user = 'etablissement'
      `, [etablissementId]);

      if (!soldeResult.length) {
        throw new HttpException('Compte non trouvé', HttpStatus.NOT_FOUND);
      }

      const { solde_compte, limite_retrait_journalier, retrait_mensuel_cumule } = soldeResult[0];

      // ✅ 4. Vérifications des montants
      if (dto.amount > solde_compte) {
        throw new HttpException(
          `Solde insuffisant. Solde actuel: ${solde_compte} XOF`, 
          HttpStatus.BAD_REQUEST
        );
      }

      if (dto.amount > limite_retrait_journalier) {
        throw new HttpException(
          `Montant supérieur à la limite journalière (${limite_retrait_journalier} XOF)`, 
          HttpStatus.BAD_REQUEST
        );
      }

      // ✅ 5. Vérifier les retraits du jour
      const retraitsDuJour = await queryRunner.query(`
        SELECT COALESCE(SUM(CAST(receive_amount AS INTEGER)), 0) as total_retrait_jour
        FROM wave_payout_session 
        WHERE id_user_etablissement_sante = $1 
        AND DATE(created_at) = CURRENT_DATE
        AND wave_status = 'succeeded'
      `, [etablissementId]);

      const totalRetraitJour = parseInt(retraitsDuJour[0].total_retrait_jour) || 0;
      
      if ((totalRetraitJour + dto.amount) > limite_retrait_journalier) {
        throw new HttpException(
          `Limite journalière atteinte. Déjà retiré: ${totalRetraitJour} XOF`, 
          HttpStatus.BAD_REQUEST
        );
      }

      // ✅ 6. Générer clé idempotency unique
      const idempotencyKey = uuidv4();

      // ✅ 7. Créer la session de payout
      const payoutSession = this.payoutRepository.create({
        id_user_etablissement_sante: etablissementId,
        idempotency_key: idempotencyKey,
        currency: 'XOF',
        receive_amount: dto.amount.toString(),
        name: etablissement.nom,
        mobile: dto.numero_wave || etablissement.numero_wave,
      });

      await queryRunner.manager.save(payoutSession);

      // ✅ 8. Appeler l'API Wave
      const waveResponse = await this.callWavePayoutAPI(payoutSession);

      // ✅ 9. Mettre à jour avec la réponse Wave
      payoutSession.wave_payout_id = waveResponse.id;
      payoutSession.wave_fee = waveResponse.fee;
      payoutSession.wave_status = waveResponse.status;
      payoutSession.wave_timestamp = new Date(waveResponse.timestamp);

      await queryRunner.manager.save(payoutSession);

      // ✅ 10. Si succès, débiter le compte
      if (waveResponse.status === 'succeeded') {
        await queryRunner.query(`
          UPDATE compte 
          SET solde_compte = solde_compte - $1,
              retrait_mensuel_cumule = retrait_mensuel_cumule + $1,
              date_modification = CURRENT_TIMESTAMP
          WHERE id_user_etablissement_sante = $2
        `, [dto.amount, etablissementId]);

        // ✅ 11. Créer transaction externe
        await this.createTransactionExterne(queryRunner, etablissementId, payoutSession, dto.amount);
      }

      await queryRunner.commitTransaction();

      return {
        payoutId: payoutSession.wave_payout_id,
        idempotencyKey: payoutSession.idempotency_key,
        amount: payoutSession.receive_amount,
        currency: payoutSession.currency,
        mobile: payoutSession.mobile,
        status: payoutSession.wave_status,
        createdAt: payoutSession.created_at
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Erreur lors du retrait Wave:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        `Erreur lors du retrait: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      await queryRunner.release();
    }
  }

  // 🌊 Appeler l'API Wave pour payout
  private async callWavePayoutAPI(session: WavePayoutSession) {
    try {
      const waveToken = process.env.WAVE_API_TOKEN;
      const isDevelopment = process.env.NODE_ENV === 'development' || process.env.WAVE_SIMULATE_PAYOUT === 'true';
      
      if (!waveToken) {
        throw new Error('Token Wave non configuré');
      }

      const payload = {
        currency: session.currency,
        receive_amount: session.receive_amount,
        name: session.name,
        mobile: session.mobile
      };

      console.log('🌊 Appel API Wave Payout:', payload);

      // 🧪 Mode simulation si pas de permissions payouts_api
      if (isDevelopment) {
        console.log('🧪 MODE SIMULATION - Payout simulé avec succès');
        
        // Simuler une réponse Wave réussie
        const simulatedResponse = {
          id: `pt-sim-${Date.now()}`,
          currency: session.currency,
          receive_amount: session.receive_amount,
          fee: Math.ceil(parseInt(session.receive_amount) * 0.01).toString(), // 1% de frais simulés
          mobile: session.mobile,
          name: session.name,
          status: 'succeeded',
          timestamp: new Date().toISOString()
        };

        console.log('✅ Réponse simulée:', simulatedResponse);
        return simulatedResponse;
      }

      // 🌊 Vrai appel Wave en production
      const response = await firstValueFrom(
        this.httpService.post('https://api.wave.com/v1/payout', payload, {
          headers: {
            'Authorization': `Bearer ${waveToken}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': session.idempotency_key
          }
        })
      );

      console.log('✅ Réponse Wave:', response.data);
      return response.data;

    } catch (error) {
      console.error('❌ Erreur API Wave:', error.response?.data || error.message);
      
      // Si erreur de permissions, expliquer clairement
      if (error.response?.data?.message?.includes('payouts_api')) {
        throw new Error('Permissions Wave insuffisantes. Votre clé API doit avoir la permission "payouts_api". Contactez Wave pour l\'ajouter.');
      }
      
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'appel à Wave');
    }
  }

  // 📝 Créer transaction externe
// 📝 Créer transaction externe
private async createTransactionExterne(queryRunner: any, etablissementId: number, session: WavePayoutSession, amount: number) {
  // Créer d'abord les frais de transaction avec ID temporaire
  const fraisResult = await queryRunner.query(`
    INSERT INTO transactions_frais (id_transaction, montant_frais, type_transaction, mode_paiement)
    VALUES (-1, $1, 'externe', 'mobile_money')
    RETURNING id_frais
  `, [parseFloat(session.wave_fee) || 0]);

  // Obtenir l'id du compte
  const compteResult = await queryRunner.query(`
    SELECT id_compte FROM compte 
    WHERE id_user_etablissement_sante = $1 AND type_user = 'etablissement'
  `, [etablissementId]);

  const idCompte = compteResult[0].id_compte;

  // Créer la transaction externe
  const transactionResult = await queryRunner.query(`
    INSERT INTO transaction_externe (
      id_utilisateur, montant, frais_transaction, statut, devise,
      type_transaction, moyen_paiement, reference_externe, motif,
      id_compte, wave_payout_id, idempotency_key
    ) VALUES (
      NULL, $1, $2, $3, 'XOF',
      'retrait', 'wave', $4, 'Retrait Wave vers compte mobile',
      $5, $6, $7
    ) RETURNING id_transaction_externe
  `, [
    amount,
    parseFloat(session.wave_fee) || 0,
    session.wave_status === 'succeeded' ? 'reussie' : 'en attente',
    session.wave_payout_id,
    idCompte,
    session.wave_payout_id,
    session.idempotency_key
  ]);

  // Mettre à jour les frais avec le vrai ID
  await queryRunner.query(`
    UPDATE transactions_frais 
    SET id_transaction = $1 
    WHERE id_frais = $2
  `, [transactionResult[0].id_transaction_externe, fraisResult[0].id_frais]);
}

  // 📊 Récupérer le statut d'un payout
  async getPayoutStatus(payoutId: string) {
    const payout = await this.payoutRepository.findOne({
      where: { wave_payout_id: payoutId }
    });

    if (!payout) {
      throw new HttpException('Payout non trouvé', HttpStatus.NOT_FOUND);
    }

    return {
      payoutId: payout.wave_payout_id,
      status: payout.wave_status,
      amount: payout.receive_amount,
      currency: payout.currency,
      waveStatus: payout.wave_status,
      waveFee: payout.wave_fee,
      waveTimestamp: payout.wave_timestamp,
      isCompleted: payout.wave_status === 'succeeded'
    };
  }

  // 📜 Historique des retraits d'un établissement
  async getPayoutHistory(etablissementId: number) {
    return await this.payoutRepository.find({
      where: { id_user_etablissement_sante: etablissementId },
      order: { created_at: 'DESC' },
      take: 50
    });
  }

  // 💰 Récupérer le solde disponible pour retrait
  async getAvailableBalance(etablissementId: number) {
    const result = await this.dataSource.query(`
      SELECT 
        solde_compte,
        limite_retrait_journalier,
        retrait_mensuel_cumule,
        plafond
      FROM compte 
      WHERE id_user_etablissement_sante = $1 AND type_user = 'etablissement'
    `, [etablissementId]);

    if (!result.length) {
      throw new HttpException('Compte non trouvé', HttpStatus.NOT_FOUND);
    }

    const compte = result[0];

    // Calculer les retraits du jour
    const retraitsDuJour = await this.dataSource.query(`
      SELECT COALESCE(SUM(CAST(receive_amount AS INTEGER)), 0) as total_retrait_jour
      FROM wave_payout_session 
      WHERE id_user_etablissement_sante = $1 
      AND DATE(created_at) = CURRENT_DATE
      AND wave_status = 'succeeded'
    `, [etablissementId]);

    const totalRetraitJour = parseInt(retraitsDuJour[0].total_retrait_jour) || 0;

    return {
      solde_disponible: compte.solde_compte,
      limite_journaliere: compte.limite_retrait_journalier,
      deja_retire_aujourd_hui: totalRetraitJour,
      limite_restante_jour: compte.limite_retrait_journalier - totalRetraitJour,
      retrait_mensuel_cumule: compte.retrait_mensuel_cumule,
      plafond_mensuel: compte.plafond,
      devise: 'XOF'
    };
  }

  // 🔍 Récupérer les limites de retrait
  async getWithdrawLimits(etablissementId: number) {
    const balance = await this.getAvailableBalance(etablissementId);
    
    return {
      limite_journaliere: balance.limite_journaliere,
      limite_restante_jour: balance.limite_restante_jour,
      deja_retire_aujourd_hui: balance.deja_retire_aujourd_hui,
      retrait_mensuel_cumule: balance.retrait_mensuel_cumule,
      plafond_mensuel: balance.plafond_mensuel,
      montant_minimum: 100,
      montant_maximum_par_transaction: balance.limite_journaliere,
      devise: 'XOF'
    };
  }

  // 🔐 Vérifier et mettre à jour le numéro Wave
  async updateWaveNumber(etablissementId: number, numeroWave: string) {
    const etablissement = await this.etablissementRepository.findOne({
      where: { id_user_etablissement_sante: etablissementId }
    });

    if (!etablissement) {
      throw new HttpException('Établissement non trouvé', HttpStatus.NOT_FOUND);
    }

    // Mettre à jour le numéro et désactiver la vérification
    etablissement.numero_wave = numeroWave;
    etablissement.wave_verified = false;
    await this.etablissementRepository.save(etablissement);

    // Générer et envoyer OTP
    await this.generateAndSendWaveOtp(etablissementId);

    return {
      message: 'Numéro Wave configuré. Un code de vérification a été envoyé par email.',
      numero_wave: numeroWave,
      wave_verified: false,
      otp_sent: true
    };
  }

  // 🔑 Générer et envoyer OTP de vérification Wave
  async generateAndSendWaveOtp(etablissementId: number) {
    const etablissement = await this.etablissementRepository.findOne({
      where: { id_user_etablissement_sante: etablissementId }
    });

    if (!etablissement) {
      throw new HttpException('Établissement non trouvé', HttpStatus.NOT_FOUND);
    }

    if (!etablissement.email) {
      throw new HttpException('Email non configuré pour cet établissement', HttpStatus.BAD_REQUEST);
    }

    // Invalider les anciens OTP
    await this.otpRepository.update(
  { id_user_etablissement_sante: etablissementId.toString(), is_valid: true },
  { is_valid: false }
);

    // Générer nouveau OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes

    // Sauvegarder OTP
    const otp = this.otpRepository.create({
      id_user_etablissement_sante: etablissementId.toString(),
      otp_code: otpCode,
      moyen_envoyer: 'EMAIL' as any,
      expires_at: expiresAt,
      is_valid: true
    });

    await this.otpRepository.save(otp);

    // Envoyer email
    await this.waveEmailService.sendWaveVerificationOtp(
      etablissement.email,
      otpCode,
      etablissement.nom
    );

    return {
      message: 'Code OTP envoyé par email',
      expires_in_minutes: 10
    };
  }

  // ✅ Vérifier OTP et activer Wave
  async verifyWaveOtp(etablissementId: number, otpCode: string) {
    const etablissement = await this.etablissementRepository.findOne({
      where: { id_user_etablissement_sante: etablissementId }
    });

    if (!etablissement) {
      throw new HttpException('Établissement non trouvé', HttpStatus.NOT_FOUND);
    }

    // Vérifier OTP
    const otp = await this.otpRepository.findOne({
      where: {
        id_user_etablissement_sante: etablissementId.toString(),
        otp_code: otpCode,
        is_valid: true
      }
    });

    if (!otp) {
      throw new HttpException('Code OTP invalide', HttpStatus.BAD_REQUEST);
    }

    // Vérifier expiration
    if (new Date() > otp.expires_at) {
      // Invalider l'OTP expiré
      otp.is_valid = false;
      await this.otpRepository.save(otp);
      throw new HttpException('Code OTP expiré', HttpStatus.BAD_REQUEST);
    }

    // Invalider l'OTP utilisé
    otp.is_valid = false;
    await this.otpRepository.save(otp);

    // Activer Wave
    etablissement.wave_verified = true;
    await this.etablissementRepository.save(etablissement);

    // Envoyer email de confirmation
    await this.waveEmailService.sendWaveActivationConfirmation(
      etablissement.email,
      etablissement.nom,
      etablissement.numero_wave
    );

    return {
      message: 'Compte Wave vérifié et activé avec succès',
      numero_wave: etablissement.numero_wave,
      wave_verified: true
    };
  }

  // 🔄 Renvoyer OTP (si expiré ou perdu)
  async resendWaveOtp(etablissementId: number) {
    const etablissement = await this.etablissementRepository.findOne({
      where: { id_user_etablissement_sante: etablissementId }
    });

    if (!etablissement) {
      throw new HttpException('Établissement non trouvé', HttpStatus.NOT_FOUND);
    }

    if (!etablissement.numero_wave) {
      throw new HttpException('Numéro Wave non configuré', HttpStatus.BAD_REQUEST);
    }

    if (etablissement.wave_verified) {
      throw new HttpException('Compte Wave déjà vérifié', HttpStatus.BAD_REQUEST);
    }

    // Renvoyer OTP
    return await this.generateAndSendWaveOtp(etablissementId);
  }
}