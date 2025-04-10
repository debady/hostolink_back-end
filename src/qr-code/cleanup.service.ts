// import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, LessThan } from 'typeorm';
// import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';
// import { QrCodeService } from './qr-code.service';

// @Injectable()
// export class CleanupService {
//   private readonly logger = new Logger(CleanupService.name);
  

//   constructor(
//     @Inject(forwardRef(() => QrCodeService))
//     private readonly qrCodeService: QrCodeService,

//     @InjectRepository(QrCodeDynamique)
//     private readonly qrCodeDynamiqueRepository: Repository<QrCodeDynamique>,
//   ) {}

//   /**
//    * Tâche programmée pour désactiver les QR codes expirés et supprimer les anciens
//    * S'exécute tous les jours à minuit
//    */
//   @Cron('0 0 * * *')
//   async scheduledCleanup() {
//     // this.logger.log('Début du nettoyage programmé des QR codes dynamiques');
    
//     // Étape 1: Marquer comme inactifs tous les QR codes expirés
//     const deactivatedCount = await this.qrCodeService.updateExpiredQrCodesStatus();
//     this.logger.log(`${deactivatedCount} QR codes dynamiques expirés désactivés`);
    
//     // Étape 2: Supprimer les QR codes expirés depuis longtemps (7 jours par défaut)
//     const deletedCount = await this.qrCodeService.deleteOldExpiredQrCodes(7);
//     this.logger.log(`${deletedCount} QR codes dynamiques anciens supprimés`);
    
//     // this.logger.log('Nettoyage programmé terminé');
//   }
  
//   /**
//    * Tâche programmée pour désactiver les QR codes expirés
//    * S'exécute toutes les 10 minutes
//    */
 

//   async deactivateExpiredQrCodes(): Promise<void> {
//     const now = new Date();
  
//     // 1. Récupérer les utilisateurs affectés AVANT mise à jour
//     const expiredCodes = await this.qrCodeDynamiqueRepository.find({
//       where: {
//         statut: 'actif',
//         date_expiration: LessThan(now),
//       },
//       select: ['id_user'],
//     });
  
//     const userIds = [...new Set(expiredCodes.map(code => code.id_user))]; // uniques
  
//     // 2. Mettre à jour les statuts
//     const result = await this.qrCodeDynamiqueRepository.update(
//       {
//         statut: 'actif',
//         date_expiration: LessThan(now),
//       },
//       {
//         statut: 'inactif',
//       },
//     );
  
//     // this.logger.log(`${result.affected} QR codes dynamiques expirés ont été désactivés`);
  
//     // 3. Générer automatiquement un nouveau QR code dynamique pour chaque utilisateur
//     for (const id_user of userIds) {
//       await this.qrCodeService.createDynamicQrForUser(id_user);
//       // this.logger.log(`Nouveau QR code généré pour l'utilisateur ${id_user}`);
//     }
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



import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, In } from 'typeorm';
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
   * Tâche programmée pour mettre à jour les QR codes expirés et supprimer les anciens
   * S'exécute tous les jours à minuit
   */
  @Cron('0 0 * * *')
  async scheduledCleanup() {
    this.logger.log('Début du nettoyage programmé des QR codes dynamiques');
    
    // Étape 1: Mettre à jour tous les QR codes expirés
    const updatedCount = await this.updateExpiredQrCodes();
    this.logger.log(`${updatedCount} QR codes dynamiques expirés mis à jour`);
    
    // Étape 2: Supprimer les QR codes expirés depuis longtemps (7 jours par défaut)
    const deletedCount = await this.qrCodeService.deleteOldExpiredQrCodes(7);
    this.logger.log(`${deletedCount} QR codes dynamiques anciens supprimés`);
    
    this.logger.log('Nettoyage programmé terminé');
  }
  




  /**
   * Met à jour les QR codes expirés (au lieu de les désactiver)
   */
  // async updateExpiredQrCodes(): Promise<number> {
  //   const now = new Date();
  
  //   // 1. Récupérer les QR codes expirés
  //   const expiredCodes = await this.qrCodeDynamiqueRepository.find({
  //     where: {
  //       statut: 'actif',
  //       date_expiration: LessThan(now),
  //     },
  //   });
    
  //   let updatedCount = 0;
    
  //   // 2. Mettre à jour chaque QR code expiré
  //   for (const qrCode of expiredCodes) {
  //     try {
  //       // Créer temporairement un nouveau QR code pour récupérer un nouveau token et une nouvelle date d'expiration
  //       const tempNewQrCode = await this.qrCodeService.createDynamicQrForUser(
  //         qrCode.id_user,
  //         undefined, // Nous laissons la méthode récupérer le numéro de compte
  //         60 // Durée par défaut (60 secondes)
  //       );
        
  //       // Mettre à jour l'ancien QR code avec les nouvelles informations
  //       qrCode.token = tempNewQrCode.token;
  //       qrCode.date_expiration = tempNewQrCode.date_expiration;
  //       // qrCode.date_modification = new Date(); // Mettre à jour la date de modification
        
  //       // Sauvegarder les modifications
  //       await this.qrCodeDynamiqueRepository.save(qrCode);
        
  //       // Supprimer le QR code temporaire
  //       await this.qrCodeDynamiqueRepository.delete(tempNewQrCode.id_qrcode);
        
  //       updatedCount++;
        
  //       this.logger.log(`QR code ${qrCode.id_qrcode} mis à jour pour l'utilisateur ${qrCode.id_user}`);
  //     } catch (error) {
  //       this.logger.error(`Erreur lors de la mise à jour du QR code ${qrCode.id_qrcode}: ${error.message}`);
  //     }
  //   }
    
  //   return updatedCount;
  // }

  async updateExpiredQrCodes(): Promise<number> {
    const now = new Date();
  
    // 1. Récupérer les QR codes expirés qui sont actifs
    const expiredCodes = await this.qrCodeDynamiqueRepository.find({
      where: {
        statut: 'actif',
        date_expiration: LessThan(now),
      },
    });
    
    let updatedCount = 0;
    
    // 2. Pour chaque utilisateur, mettre à jour son QR code le plus récent
    const userGroups = new Map();
    
    // Regrouper les QR codes par utilisateur
    expiredCodes.forEach(qrCode => {
      if (!userGroups.has(qrCode.id_user)) {
        userGroups.set(qrCode.id_user, []);
      }
      userGroups.get(qrCode.id_user).push(qrCode);
    });
    
    // Pour chaque utilisateur, mettre à jour uniquement le QR code le plus récent
    for (const [userId, userCodes] of userGroups.entries()) {
      try {
        // Trier par date de création décroissante
        userCodes.sort((a, b) => b.date_creation.getTime() - a.date_creation.getTime());
        
        // Prendre le QR code le plus récent
        const latestQrCode = userCodes[0];
        
        // Créer temporairement un nouveau QR code pour récupérer un nouveau token
        const compte = await this.qrCodeService['compteService'].getUserCompte(userId);
        const tempPayload = this.qrCodeService['createUserPayload'](
          userId, 
          true, 
          60, 
          { 
            accountNumber: compte?.numero_compte,
            currency: compte?.devise
          }
        );
        const token = this.qrCodeService['generateTokenWithPayload'](tempPayload);
        
        // Mettre à jour l'ancien QR code avec les nouvelles informations
        latestQrCode.token = token;
        latestQrCode.date_expiration = new Date(tempPayload.expiresAt || Date.now() + (60 * 1000));
        
        // Sauvegarder les modifications
        await this.qrCodeDynamiqueRepository.save(latestQrCode);
        
        updatedCount++;
        
        // Marquer les autres QR codes comme inactifs pour cet utilisateur
        if (userCodes.length > 1) {
          const oldQrCodes = userCodes.slice(1);
          await this.qrCodeDynamiqueRepository.update(
            { id_qrcode: In(oldQrCodes.map(qr => qr.id_qrcode)) },
            { statut: 'inactif' }
          );
        }
      } catch (error) {
        this.logger.error(`Erreur lors de la mise à jour du QR code pour l'utilisateur ${userId}: ${error.message}`);
      }
    }
    
    return updatedCount;
  }










  /**
   * Supprime les QR codes dynamiques expirés depuis plus de 1 jours
   */
  async removeOldQrCodes(): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 1); // Supprimer les QR codes expirés depuis plus de 1 jour
    
    const result = await this.qrCodeDynamiqueRepository.delete({
      date_expiration: LessThan(cutoffDate)
    });
    
    this.logger.log(`${result.affected} QR codes dynamiques anciens ont été supprimés`);
  }

  /**
   * Permet de déclencher manuellement le nettoyage
   * Peut être exposé via un endpoint d'administration
   */
  async manualCleanup(): Promise<{ updated: number, deleted: number }> {
    // Mettre à jour les codes expirés
    const updatedCount = await this.updateExpiredQrCodes();
    
    // Supprimer les codes anciens
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);
    
    const deleteResult = await this.qrCodeDynamiqueRepository.delete({
      date_expiration: LessThan(cutoffDate)
    });
    
    return {
      updated: updatedCount,
      deleted: deleteResult.affected || 0
    };
  }
}
