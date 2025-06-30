import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WaveCheckoutSession } from './entities/wave-checkout-session.entity';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { CreateWaveSessionDto } from './dto/create-wave-session.dto';
import { TransactionsFrais } from './entities/frais_depot_wave.entity';
import { TransactionExterne } from './entities/transaction_externe.entity';
import { HistoriqueTransactions } from './entities/historique_transactions.wave.entity';
import { NotificationTransaction } from './entities/notification_transaction.entity';
import { Compte } from 'src/compte/entitie/compte.entity';
import { User } from 'src/utilisateur/entities/user.entity';

@Injectable()
export class WaveCheckoutService {
  private readonly waveApiUrl = 'https://api.wave.com/v1/checkout/sessions';
  private readonly waveApiToken: string;
  private readonly logger = new Logger(WaveCheckoutService.name);

  constructor(
    @InjectRepository(WaveCheckoutSession)
    private readonly waveSessionRepo: Repository<WaveCheckoutSession>,
    @InjectRepository(Compte)
    private readonly compteRepo: Repository<Compte>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(TransactionsFrais)
    private readonly transactionsFraisRepo: Repository<TransactionsFrais>,
    @InjectRepository(TransactionExterne)
    private readonly transactionExterneRepo: Repository<TransactionExterne>,
    @InjectRepository(HistoriqueTransactions)
    private readonly historiqueRepo: Repository<HistoriqueTransactions>,
    @InjectRepository(NotificationTransaction)
    private readonly notificationRepo: Repository<NotificationTransaction>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    this.waveApiToken = this.configService.get<string>('WAVE_API_TOKEN') ?? '';
    if (!this.waveApiToken) {
      throw new Error('WAVE_API_TOKEN is not defined in environment variables.');
    }
  }

  async createSession(dto: CreateWaveSessionDto): Promise<WaveCheckoutSession> {
    try {
      const response = await axios.post(
        this.waveApiUrl,
        {
          amount: dto.amount,
          currency: dto.currency || 'XOF',
          client_reference: dto.clientReference,
          success_url: dto.successUrl,
          error_url: dto.errorUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${this.waveApiToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const data = response.data;
      console.log('🌊 Réponse Wave:', data);

      const session = this.waveSessionRepo.create({
        idUser: dto.idUser,
        sessionId: data.id,
        waveLaunchUrl: data.wave_launch_url,
        clientReference: dto.clientReference,
        amount: dto.amount,
        currency: dto.currency || 'XOF',
        successUrl: dto.successUrl,
        errorUrl: dto.errorUrl, 
        status: 'pending',
      });

      return await this.waveSessionRepo.save(session);
    } catch (error) {
      this.logger.error(
        'Erreur lors de la création de session Wave',
        error?.response?.data || error.message,
      );
      throw new HttpException(
        error?.response?.data || 'Wave session creation failed',
        error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSessionStatus(sessionId: string, status: string): Promise<void> {
    const result = await this.waveSessionRepo.update(
      { sessionId },
      {
        status,
        updatedAt: new Date(),
        webhookReceived: true,
      },
    );

    if (result.affected === 0) {
      throw new HttpException(
        'Session Wave introuvable',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findBySessionId(sessionId: string): Promise<WaveCheckoutSession | null> {
    return await this.waveSessionRepo.findOne({
      where: { sessionId },
      relations: ['user'],
    });
  }

  /**
   * Traite le webhook Wave après un paiement réussi
   * @param webhookPayload Payload reçu de Wave
   */
  // async handleWebhook(webhookPayload: any): Promise<void> {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     this.logger.log(`Traitement du webhook Wave: ${JSON.stringify(webhookPayload)}`);

  //     // Vérifier le type d'événement
  //     if (webhookPayload.event_type !== 'checkout.session.completed') {
  //       this.logger.warn(`Type d'événement non supporté: ${webhookPayload.event_type}`);
  //       return;
  //     }

  //     const sessionId = webhookPayload.data?.id;
  //     if (!sessionId) {
  //       throw new HttpException('Session ID manquant dans le webhook', HttpStatus.BAD_REQUEST);
  //     }

  //     // ÉTAPE 1: Mettre à jour la session Wave
  //     await this.updateSessionStatus(sessionId, 'completed');
  //     this.logger.log(`Session ${sessionId} mise à jour vers 'completed'`);

  //     // ÉTAPE 2: Récupérer les informations nécessaires
  //     const waveSession = await this.findBySessionId(sessionId);
  //     if (!waveSession) {
  //       throw new HttpException(`Session Wave ${sessionId} introuvable`, HttpStatus.NOT_FOUND);
  //     }

  //     // Récupérer l'utilisateur via son UUID
  //     const user = await queryRunner.manager.findOne(User, {
  //       where: { id_user: waveSession.idUser }
  //     });
  //     if (!user) {
  //       throw new HttpException(`Utilisateur ${waveSession.idUser} introuvable`, HttpStatus.NOT_FOUND);
  //     }

  //     // Récupérer le compte de l'utilisateur
  //     const compte = await queryRunner.manager.findOne(Compte, {
  //       where: { id_user: waveSession.idUser }
  //     });
  //     if (!compte) {
  //       throw new HttpException(`Compte pour utilisateur ${waveSession.idUser} introuvable`, HttpStatus.NOT_FOUND);
  //     }
  //     this.logger.log(`Utilisateur trouvé: id_utilisateur=${user.id_user}, id_compte=${compte.id_compte}`);

  //     // ÉTAPE 3: Insérer dans transactions_frais
  //     // const transactionFrais = queryRunner.manager.create(TransactionsFrais, {
  //     //   montant_frais: 0,
  //     //   type_transaction: 'externe',
  //     //   mode_paiement: 'wave_money',
  //     //   date_creation: new Date(),
  //     // });

  //     // // Sauvegarder pour obtenir l'id_transaction généré
  //     // const savedFrais = await queryRunner.manager.save(TransactionsFrais, transactionFrais);
  //     // const idTransaction = savedFrais.id_frais; // L'ID généré qu'on utilise comme id_transaction

  //     // // Mettre à jour l'id_transaction dans la même ligne
  //     // await queryRunner.manager.update(TransactionsFrais, savedFrais.id_frais, {
  //     //   id_transaction: idTransaction
  //     // });

  //     // ✅ NOUVEAU CODE CORRIGÉ
  //     // D'abord créer sans sauvegarder pour obtenir un ID temporaire
  //     const tempId = Math.floor(Math.random() * 1000000); // ID temporaire unique

  //     const transactionFrais = queryRunner.manager.create(TransactionsFrais, {
  //       id_transaction: tempId, // Définir explicitement pour éviter NULL
  //       montant_frais: 0,
  //       type_transaction: 'externe',
  //       mode_paiement: 'wave_money',
  //       date_creation: new Date(),
  //     });

  //     // Sauvegarder pour obtenir l'id_frais généré
  //     const savedFrais = await queryRunner.manager.save(TransactionsFrais, transactionFrais);
  //     const idTransaction = savedFrais.id_frais;

  //     // Mettre à jour avec le vrai id_transaction (= id_frais)
  //     await queryRunner.manager.update(TransactionsFrais, savedFrais.id_frais, {
  //       id_transaction: idTransaction
  //     });

  //     this.logger.log(`Transaction frais créée: id_transaction=${idTransaction}`);

  //     // ÉTAPE 4: Insérer dans transaction_externe
  //     const transactionExterne = queryRunner.manager.create(TransactionExterne, {
  //       id_utilisateur: user.id_user,
  //       montant: waveSession.amount,
  //       frais_transaction: 0,
  //       statut: 'effectué',
  //       devise: waveSession.currency,
  //       type_transaction: 'depot',
  //       moyen_paiement: 'wave',
  //       reference_externe: waveSession.clientReference,
  //       motif: 'Dépôt via Wave',
  //       id_compte: compte.id_compte,
  //       id_moyen_paiement: 1,
  //       id_transaction: idTransaction,
  //       date_transaction: new Date(),
  //     });

  //     const savedTransactionExterne = await queryRunner.manager.save(TransactionExterne, transactionExterne);
  //     this.logger.log(`Transaction externe créée: id=${savedTransactionExterne.id_transaction_externe}`);

  //     // ÉTAPE 5: Créditer le compte
  //     await queryRunner.manager.update(Compte, compte.id_compte, {
  //       solde_compte: () => `solde_compte + ${waveSession.amount}`,
  //       date_modification: new Date(),
  //     });

  //     this.logger.log(`Compte ${compte.id_compte} crédité de ${waveSession.amount} ${waveSession.currency}`);

  //     // ÉTAPE 6: Insérer dans historique_transactions
  //     const historique = queryRunner.manager.create(HistoriqueTransactions, {
  //       id_transaction: idTransaction,
  //       ancien_statut: 'en attente',
  //       nouveau_statut: 'effectué',
  //       id_user: waveSession.idUser,
  //       date_modification: new Date(),
  //     });

  //     await queryRunner.manager.save(HistoriqueTransactions, historique);
  //     this.logger.log(`Historique créé pour transaction ${idTransaction}`);

  //     // ÉTAPE 7: Créer notification depot_wave
  //     const notification = queryRunner.manager.create(NotificationTransaction, {
  //       id_transaction: idTransaction,
  //       identif_transaction: `Hstlk-${Math.random().toString(36).substring(2, 7)}`,
  //       type_notification: 'depot',
  //       contenu: `Votre dépôt de ${waveSession.amount} ${waveSession.currency} via Wave a été crédité avec succès.`,
  //       montant: waveSession.amount,
  //       id_user: waveSession.idUser,
  //       date_envoi: new Date(),
  //       statut: 'envoyé',
  //       is_lu: false,
  //     });

  //     await queryRunner.manager.save(NotificationTransaction, notification);
  //     this.logger.log(`Notification créée pour l'utilisateur ${waveSession.idUser}`);

  //     // Valider la transaction
  //     await queryRunner.commitTransaction();
  //     this.logger.log(`✅ Webhook Wave traité avec succès pour la session ${sessionId}`);

  //   } catch (error) {
  //     // Annuler la transaction en cas d'erreur
  //     await queryRunner.rollbackTransaction();
  //     this.logger.error(`❌ Erreur lors du traitement du webhook Wave:`, error);
  //     throw error;
  //   } finally {
  //     // Libérer les ressources
  //     await queryRunner.release();
  //   }
  // }

  /**
 * Traite le webhook Wave après un paiement réussi
 * @param webhookPayload Payload reçu de Wave
 */
async handleWebhook(webhookPayload: any): Promise<void> {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    this.logger.log(`Traitement du webhook Wave: ${JSON.stringify(webhookPayload)}`);

    // ✅ CORRECTION: Vérifier le type d'événement
    if (webhookPayload.type !== 'checkout.session.completed') {
      this.logger.warn(`Type d'événement non supporté: ${webhookPayload.type}`);
      return;
    }

    // ✅ CORRECTION: Les données sont dans webhookPayload.data
    const sessionData = webhookPayload.data;
    if (!sessionData) {
      throw new HttpException('Données de session manquantes dans le webhook', HttpStatus.BAD_REQUEST);
    }

    // ✅ CORRECTION: Vérifier les statuts dans data
    if (sessionData.checkout_status !== 'complete' || sessionData.payment_status !== 'succeeded') {
      this.logger.warn(`Paiement non finalisé: checkout_status=${sessionData.checkout_status}, payment_status=${sessionData.payment_status}`);
      return;
    }

    // ✅ CORRECTION: L'ID de session est dans data.id
    const sessionId = sessionData.id;
    if (!sessionId) {
      throw new HttpException('Session ID manquant dans le webhook', HttpStatus.BAD_REQUEST);
    }

    this.logger.log(`Traitement du paiement Wave réussi pour session: ${sessionId}`);

    // ÉTAPE 1: Mettre à jour la session Wave
    await this.updateSessionStatus(sessionId, 'completed');
    this.logger.log(`Session ${sessionId} mise à jour vers 'completed'`);

    // ÉTAPE 2: Récupérer les informations nécessaires
    const waveSession = await this.findBySessionId(sessionId);
    if (!waveSession) {
      throw new HttpException(`Session Wave ${sessionId} introuvable`, HttpStatus.NOT_FOUND);
    }

    // Récupérer l'utilisateur via son UUID
    const user = await queryRunner.manager.findOne(User, {
      where: { id_user: waveSession.idUser }
    });
    if (!user) {
      throw new HttpException(`Utilisateur ${waveSession.idUser} introuvable`, HttpStatus.NOT_FOUND);
    }

    // Récupérer le compte de l'utilisateur
    const compte = await queryRunner.manager.findOne(Compte, {
      where: { id_user: waveSession.idUser }
    });
    if (!compte) {
      throw new HttpException(`Compte pour utilisateur ${waveSession.idUser} introuvable`, HttpStatus.NOT_FOUND);
    }
    this.logger.log(`Utilisateur trouvé: id_utilisateur=${user.id_user}, id_compte=${compte.id_compte}`);

    // ÉTAPE 3: Insérer dans transactions_frais
    const tempId = Math.floor(Math.random() * 1000000);

    const transactionFrais = queryRunner.manager.create(TransactionsFrais, {
      id_transaction: tempId,
      montant_frais: 0,
      type_transaction: 'externe',
      mode_paiement: 'wave_money',
      date_creation: new Date(),
    });

    const savedFrais = await queryRunner.manager.save(TransactionsFrais, transactionFrais);
    const idTransaction = savedFrais.id_frais;

    await queryRunner.manager.update(TransactionsFrais, savedFrais.id_frais, {
      id_transaction: idTransaction
    });

    this.logger.log(`Transaction frais créée: id_transaction=${idTransaction}`);

    // ÉTAPE 4: Insérer dans transaction_externe
    const transactionExterne = queryRunner.manager.create(TransactionExterne, {
      id_utilisateur: user.id_user,
      montant: waveSession.amount,
      frais_transaction: 0,
      statut: 'effectué',
      devise: waveSession.currency,
      type_transaction: 'depot',
      moyen_paiement: 'wave',
      reference_externe: waveSession.clientReference,
      motif: 'Dépôt via Wave',
      id_compte: compte.id_compte,
      id_moyen_paiement: 1,
      id_transaction: idTransaction,
      date_transaction: new Date(),
    });

    const savedTransactionExterne = await queryRunner.manager.save(TransactionExterne, transactionExterne);
    this.logger.log(`Transaction externe créée: id=${savedTransactionExterne.id_transaction_externe}`);

    // ÉTAPE 5: Créditer le compte
    await queryRunner.manager.update(Compte, compte.id_compte, {
      solde_compte: () => `solde_compte + ${waveSession.amount}`,
      date_modification: new Date(),
    });

    this.logger.log(`Compte ${compte.id_compte} crédité de ${waveSession.amount} ${waveSession.currency}`);

    // ÉTAPE 6: Insérer dans historique_transactions
    const historique = queryRunner.manager.create(HistoriqueTransactions, {
      id_transaction: idTransaction,
      ancien_statut: 'en attente',
      nouveau_statut: 'effectué',
      id_user: waveSession.idUser,
      date_modification: new Date(),
    });

    await queryRunner.manager.save(HistoriqueTransactions, historique);
    this.logger.log(`Historique créé pour transaction ${idTransaction}`);

    // ÉTAPE 7: Créer notification depot_wave
    const notification = queryRunner.manager.create(NotificationTransaction, {
      id_transaction: idTransaction,
      identif_transaction: `Hstlk-${Math.random().toString(36).substring(2, 7)}`,
      type_notification: 'depot',
      contenu: `Votre dépôt de ${waveSession.amount} ${waveSession.currency} via Wave a été crédité avec succès.`,
      montant: waveSession.amount,
      id_user: waveSession.idUser,
      date_envoi: new Date(),
      statut: 'envoyé',
      is_lu: false,
    });

    await queryRunner.manager.save(NotificationTransaction, notification);
    this.logger.log(`Notification créée pour l'utilisateur ${waveSession.idUser}`);

    // Valider la transaction
    await queryRunner.commitTransaction();
    this.logger.log(`✅ Webhook Wave traité avec succès pour la session ${sessionId}`);

  } catch (error) {
    await queryRunner.rollbackTransaction();
    this.logger.error(`❌ Erreur lors du traitement du webhook Wave:`, error);
    throw error;
  } finally {
    await queryRunner.release();
  }
}


  async findByClientReference(clientReference: string): Promise<WaveCheckoutSession | null> {
  return await this.waveSessionRepo.findOne({
    where: { clientReference }
  });
}
}
