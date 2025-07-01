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
import { NotificationService } from 'src/module_notification_push/notif_push.service';

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
    private readonly notificationService: NotificationService,
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

  // ✅ NOUVEAU : Envoyer la notification push
  try {
    if (user.fcm_token) {
      await this.notificationService.sendToToken(
        user.fcm_token,
        '💰 Dépôt réussi !',
        `Votre compte a été crédité de ${waveSession.amount} ${waveSession.currency} via Wave.`
      );
      this.logger.log(`✅ Notification push envoyée à ${waveSession.idUser}`);
    } else {
      this.logger.warn(`⚠️ Pas de FCM token pour l'utilisateur ${waveSession.idUser}`);
    }
  } catch (pushError) {
    this.logger.error(`❌ Erreur notification push:`, pushError);
    // Ne pas faire échouer la transaction pour une erreur de push
  }

      // await queryRunner.manager.save(NotificationTransaction, notification);
      // this.logger.log(`Notification créée pour l'utilisateur ${waveSession.idUser}`);

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



/**
 * Récupérer toutes les notifications d'un utilisateur
 */
async getUserNotifications(userId: string) {
  try {
    const notifications = await this.notificationRepo.find({
      where: { id_user: userId },
      order: { date_envoi: 'DESC' }, // Plus récentes en premier
    });

    return notifications.map(notif => ({
      id: notif.id_notification_transaction,
      id_transaction: notif.id_transaction,
      identifiant: notif.identif_transaction,
      type: notif.type_notification,
      contenu: notif.contenu,
      montant: notif.montant,
      date_envoi: notif.date_envoi,
      statut: notif.statut,
      lu: notif.is_lu
    }));
  } catch (error) {
    this.logger.error(`Erreur récupération notifications pour ${userId}:`, error);
    throw new HttpException(
      'Impossible de récupérer les notifications',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Récupérer tous les dépôts Wave d'un utilisateur
 */
async getUserDeposits(userId: string) {
  try {
    // Récupérer les dépôts via transaction_externe
    const deposits = await this.transactionExterneRepo.find({
      where: { 
        id_utilisateur: userId,
        type_transaction: 'depot',
        moyen_paiement: 'wave'
      },
      order: { date_transaction: 'DESC' }, // Plus récents en premier
    });

    return deposits.map(depot => ({
      id: depot.id_transaction_externe,
      montant: depot.montant,
      devise: depot.devise,
      statut: depot.statut,
      reference_externe: depot.reference_externe,
      date_transaction: depot.date_transaction,
      motif: depot.motif,
      frais_transaction: depot.frais_transaction
    }));
  } catch (error) {
    this.logger.error(`Erreur récupération dépôts pour ${userId}:`, error);
    throw new HttpException(
      'Impossible de récupérer les dépôts',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
}
