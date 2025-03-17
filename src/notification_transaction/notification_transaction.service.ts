// ----------------------
// Service Notification
// ----------------------
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationTransaction, NotificationType } from './entitie/notification_transaction.entity';
import { TransactionService } from 'src/transaction-interne/transaction-interne.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationTransaction)
    private notificationRepository: Repository<NotificationTransaction>,
    private transactionService: TransactionService,
  ) {}

  async createTransactionNotification(
    transactionId: number,
    type: NotificationType,
    content: string,
    montant: number,
    recipientInfo: {
      isEstablishment: boolean;
      id: string | number;
    }
  ) {
    const notification = this.notificationRepository.create({
      id_transaction: transactionId,
      type_notification: type,
      contenu: content,
      montant: montant,
    });

    if (recipientInfo.isEstablishment) {
      notification.id_user_etablissement_sante = recipientInfo.id as number;
    } else {
      notification.id_user = recipientInfo.id as string;
    }

    return this.notificationRepository.save(notification);
  }

  async getEstablishmentNotifications(establishmentId: number) {
    return this.notificationRepository.find({
      where: { id_user_etablissement_sante: establishmentId },
      order: { date_envoi: 'DESC' }
    });
  }

  async getUserNotifications(userId: string) {
    return this.notificationRepository.find({
      where: { id_user: userId },
      order: { date_envoi: 'DESC' }
    });
  }

  async markAsRead(notificationId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id_notification_transaction: notificationId }
    });

    if (!notification) {
      throw new NotFoundException(`Notification #${notificationId} non trouvée`);
    }

    notification.is_lu = true;
    return this.notificationRepository.save(notification);
  }

  async createTransactionNotifications(
    transactionId: number, 
    montantBrut: number, 
    montantNet: number,
    expediteurCompteId: number,
    destinataireInfo: {
      isEstablishment: boolean;
      id: string | number;
    }
  ) {
    // Récupérer les détails de la transaction si nécessaire
    const transaction = await this.transactionService.getTransactionById(transactionId);
    
    // Créer la notification pour l'expéditeur (débit)
    await this.createTransactionNotification(
      transactionId,
      NotificationType.DEBIT,
      `Vous avez envoyé ${montantBrut} ${transaction.devise_transaction}`,
      montantBrut,
      { isEstablishment: false, id: transaction.compteExpediteur.id_user || '' }
    );
    
    // Créer la notification pour le destinataire (crédit)
    await this.createTransactionNotification(
      transactionId,
      NotificationType.CREDIT,
      `Vous avez reçu ${montantNet} ${transaction.devise_transaction}`,
      montantNet,
      destinataireInfo
    );
    
    return { success: true };
  }
}
