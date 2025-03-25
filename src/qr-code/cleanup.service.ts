// import { Injectable, Logger } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, LessThan } from 'typeorm';
// import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';

// @Injectable()
// export class CleanupService {
//   private readonly logger = new Logger(CleanupService.name);

//   constructor(
//     @InjectRepository(QrCodeDynamique)
//     private readonly qrCodeDynamiqueRepository: Repository<QrCodeDynamique>,
//   ) {}

//   /**
//    * Tâche programmée qui s'exécute toutes les minute
//    * Met à jour et nettoie les QR codes dynamiques
//    */
//   @Cron('* * * * *') // Exécution quotidienne chaque minute
//   async scheduledCleanup() {
//     // this.logger.log('Début du nettoyage programmé des QR codes dynamiques');
    
//     // Étape 1: Marquer comme inactifs tous les QR codes expirés
//     await this.deactivateExpiredQrCodes();
    
//     // Étape 2: Supprimer les QR codes expirés depuis longtemps
//     await this.removeOldQrCodes();
    
//     // this.logger.log('Nettoyage programmé terminé');
//   }

//   /**
//    * Désactive tous les QR codes dynamiques expirés
//    */
//   async deactivateExpiredQrCodes(): Promise<void> {
//     const now = new Date();
    
//     const result = await this.qrCodeDynamiqueRepository.update(
//       { 
//         statut: 'actif',
//         date_expiration: LessThan(now)
//       },
//       { 
//         statut: 'inactif' 
//       }
//     );
    
//     // this.logger.log(`${result.affected} QR codes dynamiques expirés ont été désactivés`);
//   }

//   /**
//    * Supprime les QR codes dynamiques expirés depuis plus de 1 jours
//    */
//   async removeOldQrCodes(): Promise<void> {
//     const cutoffDate = new Date();
//     cutoffDate.setDate(cutoffDate.getDate() - 1); // Supprimer les QR codes expirés depuis plus de 7 jours
    
//     const result = await this.qrCodeDynamiqueRepository.delete({
//       date_expiration: LessThan(cutoffDate)
//     });
    
//     // this.logger.log(`${result.affected} QR codes dynamiques anciens ont été supprimés`);
//   }

//   /**
//    * Permet de déclencher manuellement le nettoyage
//    * Peut être exposé via un endpoint d'administration
//    */
//   async manualCleanup(): Promise<{ deactivated: number, deleted: number }> {
//     // Désactiver les codes expirés
//     const deactivateResult = await this.qrCodeDynamiqueRepository.update(
//       { 
//         statut: 'actif',
//         date_expiration: LessThan(new Date())
//       },
//       { 
//         statut: 'inactif' 
//       }
//     );
    
//     // Supprimer les codes anciens
//     const cutoffDate = new Date();
//     cutoffDate.setDate(cutoffDate.getDate() - 7);
    
//     const deleteResult = await this.qrCodeDynamiqueRepository.delete({
//       date_expiration: LessThan(cutoffDate)
//     });
    
//     return {
//       deactivated: deactivateResult.affected || 0,
//       deleted: deleteResult.affected || 0
//     };
//   }
// }

// src/qr-code/cleanup.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { QrCodeService } from './qr-code.service';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);

  constructor(
    private readonly qrCodeService: QrCodeService
  ) {}

  /**
   * Tâche programmée pour désactiver les QR codes expirés et supprimer les anciens
   * S'exécute tous les jours à minuit
   */
  @Cron('0 0 * * *')
  async scheduledCleanup() {
    this.logger.log('Début du nettoyage programmé des QR codes dynamiques');
    
    // Étape 1: Marquer comme inactifs tous les QR codes expirés
    const deactivatedCount = await this.qrCodeService.updateExpiredQrCodesStatus();
    this.logger.log(`${deactivatedCount} QR codes dynamiques expirés désactivés`);
    
    // Étape 2: Supprimer les QR codes expirés depuis longtemps (7 jours par défaut)
    const deletedCount = await this.qrCodeService.deleteOldExpiredQrCodes(7);
    this.logger.log(`${deletedCount} QR codes dynamiques anciens supprimés`);
    
    this.logger.log('Nettoyage programmé terminé');
  }
  
  /**
   * Tâche programmée pour désactiver les QR codes expirés
   * S'exécute toutes les 10 minutes
   */
  @Cron('*/10 * * * *')
  async frequentStatusUpdate() {
    this.logger.log('Mise à jour des statuts des QR codes expirés');
    
    const count = await this.qrCodeService.updateExpiredQrCodesStatus();
    this.logger.log(`${count} QR codes dynamiques expirés désactivés`);
  }
}