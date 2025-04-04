import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';
import { QrCodeService } from './qr-code.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);
  

  constructor(
    @Inject(forwardRef(() => QrCodeService))
    private readonly qrCodeService: QrCodeService,

    @InjectRepository(QrCodeDynamique)
    private readonly qrCodeDynamiqueRepository: Repository<QrCodeDynamique>,
  ) {}

  /**
   * Tâche programmée pour désactiver les QR codes expirés et supprimer les anciens
   * S'exécute tous les jours à minuit
   */
  @Cron('0 0 * * *')
  async scheduledCleanup() {
    // this.logger.log('Début du nettoyage programmé des QR codes dynamiques');
    
    // Étape 1: Marquer comme inactifs tous les QR codes expirés
    const deactivatedCount = await this.qrCodeService.updateExpiredQrCodesStatus();
    this.logger.log(`${deactivatedCount} QR codes dynamiques expirés désactivés`);
    
    // Étape 2: Supprimer les QR codes expirés depuis longtemps (7 jours par défaut)
    const deletedCount = await this.qrCodeService.deleteOldExpiredQrCodes(7);
    this.logger.log(`${deletedCount} QR codes dynamiques anciens supprimés`);
    
    // this.logger.log('Nettoyage programmé terminé');
  }
  
  /**
   * Tâche programmée pour désactiver les QR codes expirés
   * S'exécute toutes les 10 minutes
   */
  // async deactivateExpiredQrCodes(): Promise<void> {
  //   const now = new Date();
    
  //   const result = await this.qrCodeDynamiqueRepository.update(
  //     { 
  //       statut: 'actif',
  //       date_expiration: LessThan(now)
  //     },
  //     { 
  //       statut: 'inactif' 
  //     }
  //   );
    
    // this.logger.log(`${result.affected} QR codes dynamiques expirés ont été désactivés`);
  // }

  async deactivateExpiredQrCodes(): Promise<void> {
    const now = new Date();
  
    // 1. Récupérer les utilisateurs affectés AVANT mise à jour
    const expiredCodes = await this.qrCodeDynamiqueRepository.find({
      where: {
        statut: 'actif',
        date_expiration: LessThan(now),
      },
      select: ['id_user'],
    });
  
    const userIds = [...new Set(expiredCodes.map(code => code.id_user))]; // uniques
  
    // 2. Mettre à jour les statuts
    const result = await this.qrCodeDynamiqueRepository.update(
      {
        statut: 'actif',
        date_expiration: LessThan(now),
      },
      {
        statut: 'inactif',
      },
    );
  
    // this.logger.log(`${result.affected} QR codes dynamiques expirés ont été désactivés`);
  
    // 3. Générer automatiquement un nouveau QR code dynamique pour chaque utilisateur
    for (const id_user of userIds) {
      await this.qrCodeService.createDynamicQrForUser(id_user);
      // this.logger.log(`Nouveau QR code généré pour l'utilisateur ${id_user}`);
    }
  }
  

  /**
   * Supprime les QR codes dynamiques expirés depuis plus de 1 jours
   */
  async removeOldQrCodes(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 1); // Supprimer les QR codes expirés depuis plus de 7 jours
    
    const result = await this.qrCodeDynamiqueRepository.delete({
      date_expiration: LessThan(cutoffDate)
    });
    
    // this.logger.log(`${result.affected} QR codes dynamiques anciens ont été supprimés`);
  }

  /**
   * Permet de déclencher manuellement le nettoyage
   * Peut être exposé via un endpoint d'administration
   */
  async manualCleanup(): Promise<{ deactivated: number, deleted: number }> {
    // Désactiver les codes expirés
    const deactivateResult = await this.qrCodeDynamiqueRepository.update(
      { 
        statut: 'actif',
        date_expiration: LessThan(new Date())
      },
      { 
        statut: 'inactif' 
      }
    );
    
    // Supprimer les codes anciens
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);
    
    const deleteResult = await this.qrCodeDynamiqueRepository.delete({
      date_expiration: LessThan(cutoffDate)
    });
    
    return {
      deactivated: deactivateResult.affected || 0,
      deleted: deleteResult.affected || 0
    };
  }
}