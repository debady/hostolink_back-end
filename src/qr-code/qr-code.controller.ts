

// src/qr-code/qr-code.controller.ts
import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';


@Controller('qr-codes')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  /**
   * Génère un QR code dynamique pour l'utilisateur connecté
   */
  @Post('dynamic')
  @UseGuards(JwtAuthGuard)
  async generateDynamicQrCode(@Req() req, @Body() body: { expiresIn?: number }) {
    const id_user = req.user.id_user;
    const expiresIn = body.expiresIn || 60; // Par défaut 60 secondes
    
    // Récupérer le compte utilisateur pour obtenir le numéro de compte
    const compte = await this.qrCodeService['compteService'].getUserCompte(id_user);
    const accountNumber = compte ? compte.numero_compte : undefined;
    const currency = compte ? compte.devise : undefined;
    
    // Désactiver les anciens QR codes dynamiques avant d'en créer un nouveau
    const qrCode = await this.qrCodeService.refreshUserDynamicQrCode(
      id_user,
      accountNumber,
      expiresIn,
      currency
    );
    
    if (!qrCode) {
      return {
        success: false,
        message: 'Erreur lors de la génération du QR code dynamique',
      };
    }
    
    // Générer l'URL de l'image QR code avec l'identifiant court au lieu du token
    const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
    
    return {
      success: true,
      message: 'QR code dynamique généré avec succès',
      data: {
        id_qrcode: qrCode.id_qrcode,
        short_id: qrCode.short_id,
        token: qrCode.token, // On pourrait enlever celui-ci pour réduire la taille de la réponse
        date_expiration: qrCode.date_expiration,
        qr_code_image: qrCodeImageUrl,
      }
    };
  }

  /**
   * Récupère le QR code statique de l'utilisateur connecté
   */
  @Get('static')
  @UseGuards(JwtAuthGuard)
  async getStaticQrCode(@Req() req) {
    const id_user = req.user.id_user;
    
    // Récupérer le compte utilisateur pour obtenir le numéro de compte
    const compte = await this.qrCodeService['compteService'].getUserCompte(id_user);
    const accountNumber = compte ? compte.numero_compte : undefined;
    
    // Utiliser la méthode du service pour obtenir le QR code statique
    let qrCode = await this.qrCodeService.getUserStaticQrCode(id_user);
    
    if (!qrCode) {
      // Si aucun QR code statique n'existe, en créer un nouveau
      qrCode = await this.qrCodeService.createStaticQrForNewUser(id_user, accountNumber);
    }
    
    // Générer l'URL de l'image QR code avec l'identifiant court au lieu du token
    const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
    
    return {
      success: true,
      message: 'QR code statique récupéré',
      data: {
        id_qrcode: qrCode.id_qrcode,
        short_id: qrCode.short_id,
        token: qrCode.token, // On pourrait enlever celui-ci pour réduire la taille de la réponse
        qr_code_image: qrCodeImageUrl,
      }
    };
  }

  /**
   * Valide un QR code à partir de son identifiant court ou de son token
   */
  @Post('validate')
  async validateQrCode(@Body() body: { code: string }) {
    const validationResult = await this.qrCodeService.validateQrCode(body.code);
    
    return {
      success: true,
      message: 'QR code validé avec succès',
      data: validationResult
    };
  }

  /**
   * Rafraîchit le QR code dynamique de l'utilisateur connecté
   */
  @Post('refresh-dynamic')
  @UseGuards(JwtAuthGuard)
  async refreshDynamicQrCode(@Req() req, @Body() body: { expiresIn?: number }) {
    const id_user = req.user.id_user;
    const expiresIn = body.expiresIn || 60; // Par défaut 60 secondes
    
    // Récupérer le compte utilisateur pour obtenir le numéro de compte
    const compte = await this.qrCodeService['compteService'].getUserCompte(id_user);
    const accountNumber = compte ? compte.numero_compte : undefined;
    const currency = compte ? compte.devise : undefined;
    
    const qrCode = await this.qrCodeService.refreshUserDynamicQrCode(
      id_user,
      accountNumber,
      expiresIn,
      currency
    );
    
    // Générer l'URL de l'image QR code avec l'identifiant court
    const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
    
    return {
      success: true,
      message: 'QR code dynamique rafraîchi avec succès',
      data: {
        id_qrcode: qrCode.id_qrcode,
        short_id: qrCode.short_id,
        token: qrCode.token,
        date_expiration: qrCode.date_expiration,
        qr_code_image: qrCodeImageUrl,
      }
    };
  }

  /**
   * Récupère tous les QR codes (statiques et dynamiques) de l'utilisateur connecté
   */
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllUserQrCodes(@Req() req) {
    const id_user = req.user.id_user;
    
    // Mettre à jour le statut des QR codes expirés
    await this.qrCodeService.updateExpiredQrCodesStatus(id_user);
    
    const allQrCodes = await this.qrCodeService.getAllUserQrCodes(id_user);
    
    // Ajouter les images QR code aux codes statiques
    const staticQrCodesWithImages = await Promise.all(
      allQrCodes.static.map(async (qrCode) => {
        // Générer l'image QR code avec l'identifiant court
        const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
        return {
          ...qrCode,
          qr_code_image: qrCodeImageUrl
        };
      })
    );
    
    // Ajouter les images QR code aux codes dynamiques
    const dynamicQrCodesWithImages = await Promise.all(
      allQrCodes.dynamic.map(async (qrCode) => {
        // Générer l'image QR code avec l'identifiant court
        const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
        // Calculer le temps restant
        const now = new Date();
        const remainingTime = Math.floor((qrCode.date_expiration.getTime() - now.getTime()) / 1000);
        return {
          ...qrCode,
          remaining_seconds: remainingTime > 0 ? remainingTime : 0,
          qr_code_image: qrCodeImageUrl
        };
      })
    );
    
    return {
      success: true,
      message: 'Tous les QR codes récupérés',
      data: {
        static: staticQrCodesWithImages,
        dynamic: dynamicQrCodesWithImages
      }
    };
  }

  /**
   * Récupère les QR codes d'un utilisateur spécifique (requiert des droits d'admin)
   */
  @Get('utilisateur/:id_user')
  @UseGuards(JwtAuthGuard) // Vous pourriez ajouter un garde RoleGuard pour limiter aux admins
  async getUserQrCodes(@Param('id_user') id_user: string) {
    // Mettre à jour le statut des QR codes expirés
    await this.qrCodeService.updateExpiredQrCodesStatus(id_user);
    
    const allQrCodes = await this.qrCodeService.getAllUserQrCodes(id_user);
    
    // Ajouter les images QR code
    const staticQrCodesWithImages = await Promise.all(
      allQrCodes.static.map(async (qrCode) => {
        // Générer l'image QR code avec l'identifiant court
        const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
        return {
          ...qrCode,
          qr_code_image: qrCodeImageUrl
        };
      })
    );
    
    const dynamicQrCodesWithImages = await Promise.all(
      allQrCodes.dynamic.map(async (qrCode) => {
        // Générer l'image QR code avec l'identifiant court
        const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
        // Calculer le temps restant
        const now = new Date();
        const remainingTime = Math.floor((qrCode.date_expiration.getTime() - now.getTime()) / 1000);
        return {
          ...qrCode,
          remaining_seconds: remainingTime > 0 ? remainingTime : 0,
          qr_code_image: qrCodeImageUrl
        };
      })
    );
    
    return {
      success: true,
      message: `QR codes de l'utilisateur ${id_user} récupérés`,
      data: {
        static: staticQrCodesWithImages,
        dynamic: dynamicQrCodesWithImages
      }
    };
  }

  /**
   * Récupère un QR code spécifique
   */
  @Get(':type/:id_qrcode')
  async getQrCodeById(@Param('type') type: string, @Param('id_qrcode') id_qrcode: number) {
    if (type !== 'static' && type !== 'dynamic') {
      return {
        success: false,
        message: 'Type de QR code invalide. Utilisez "static" ou "dynamic"'
      };
    }
    
    const qrCode = await this.qrCodeService.getQrCodeById(id_qrcode, type as 'static' | 'dynamic');
    
    if (!qrCode) {
      return {
        success: false,
        message: 'QR code non trouvé'
      };
    }
    
    // Générer l'image QR code avec l'identifiant court
    const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
    
    return {
      success: true,
      message: 'QR code récupéré',
      data: {
        ...qrCode,
        qr_code_image: qrCodeImageUrl
      }
    };
  }

  /**
   * Récupère le QR code dynamique actif de l'utilisateur connecté
   */
  @Get('my-dynamic')
  @UseGuards(JwtAuthGuard)
  async getMyDynamicQrCode(@Req() req) {
    const id_user = req.user.id_user;
    
    // Mettre à jour le statut des QR codes expirés
    await this.qrCodeService.updateExpiredQrCodesStatus(id_user);
    
    // Obtenir la date actuelle
    const now = new Date();
    
    // Récupérer le compte utilisateur pour obtenir le numéro de compte
    const compte = await this.qrCodeService['compteService'].getUserCompte(id_user);
    const accountNumber = compte ? compte.numero_compte : undefined;
    const currency = compte ? compte.devise : undefined;
    
    // Récupérer les QR codes dynamiques actifs non expirés
    const dynamicQrCodes = await this.qrCodeService.getUserDynamicQrCodes(id_user);
    
    // Filtrer pour ne garder que ceux qui ne sont pas expirés
    const activeQrCodes = dynamicQrCodes.filter(qrCode => 
      qrCode.date_expiration > now && qrCode.statut === 'actif'
    );
    
    if (activeQrCodes.length === 0) {
      // Si aucun QR code actif n'est trouvé, générer un nouveau QR code dynamique
      const newQrCode = await this.qrCodeService.createDynamicQrForUser(
        id_user,
        accountNumber,
        60,
        currency
      );
      
      // Générer l'URL de l'image QR code avec l'identifiant court
      const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(newQrCode.short_id);
      
      return {
        success: true,
        message: 'Nouveau QR code dynamique généré',
        data: {
          id_qrcode: newQrCode.id_qrcode,
          short_id: newQrCode.short_id,
          token: newQrCode.token,
          date_expiration: newQrCode.date_expiration,
          qr_code_image: qrCodeImageUrl,
        }
      };
    }
    
    // Prendre le QR code le plus récent
    const latestQrCode = activeQrCodes[0]; // car ils sont déjà triés par date décroissante
    
    // Générer l'image du QR code avec l'identifiant court
    const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(latestQrCode.short_id);
    
    // Calculer le temps restant en secondes
    const remainingTime = Math.floor((latestQrCode.date_expiration.getTime() - now.getTime()) / 1000);
    
    return {
      success: true,
      message: 'QR code dynamique récupéré',
      data: {
        id_qrcode: latestQrCode.id_qrcode,
        short_id: latestQrCode.short_id,
        token: latestQrCode.token,
        date_expiration: latestQrCode.date_expiration,
        remaining_seconds: remainingTime,
        qr_code_image: qrCodeImageUrl,
      }
    };

  }






  
//   /* 
//    * Endpoints pour les établissements de santé (à décommenter plus tard)
//    */
//   /*
//   @Get('etablissement/static')
//   @UseGuards(JwtAuthGuard)
//   async getEtablissementStaticQrCode(@Req() req) {
//     // Vérifier que l'utilisateur est associé à un établissement
//     const id_etablissement = req.user.id_etablissement;
    
//     if (!id_etablissement) {
//       return {
//         success: false,
//         message: 'Vous n\'êtes pas associé à un établissement de santé'
//       };
//     }
    
//     // Utiliser la méthode du service pour obtenir le QR code statique
//     const qrCode = await this.qrCodeService.getEtablissementStaticQrCode(id_etablissement);
    
//     if (!qrCode) {
//       // Si aucun QR code statique n'existe, en créer un nouveau
//       const newQrCode = await this.qrCodeService.createStaticQrForNewEtablissement(id_etablissement);
//       const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(newQrCode.token);
      
//       return {
//         success: true,
//         message: 'Nouveau QR code statique généré pour l\'établissement',
//         data: {
//           id_qrcode: newQrCode.id_qrcode,
//           token: newQrCode.token,
//           qr_code_image: qrCodeImageUrl,
//         }
//       };
//     }
    
//     // Générer l'URL de l'image QR code
//     const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.token);
    
//     return {
//       success: true,
//       message: 'QR code statique de l\'établissement récupéré',
//       data: {
//         id_qrcode: qrCode.id_qrcode,
//         token: qrCode.token,
//         qr_code_image: qrCodeImageUrl,
//       }
//     };
//   }
  
//   @Get('etablissement/dynamic')
//   @UseGuards(JwtAuthGuard)
//   async getEtablissementDynamicQrCode(@Req() req) {
//     // Vérifier que l'utilisateur est associé à un établissement
//     const id_etablissement = req.user.id_etablissement;
    
//     if (!id_etablissement) {
//       return {
//         success: false,
//         message: 'Vous n\'êtes pas associé à un établissement de santé'
//       };
//     }
    
//     // Mettre à jour le statut des QR codes expirés
//     await this.qrCodeService.updateExpiredQrCodesStatus();
    
//     // Récupérer les QR codes dynamiques actifs de l'établissement
//     const dynamicQrCodes = await this.qrCodeService.getEtablissementDynamicQrCodes(id_etablissement);
    
//     const now = new Date();
//     const activeQrCodes = dynamicQrCodes.filter(qrCode => 
//       qrCode.date_expiration > now && qrCode.statut === 'actif'
//     );
    
//     if (activeQrCodes.length === 0) {
//       // Si aucun QR code actif n'est trouvé, générer un nouveau QR code dynamique
//       const newQrCode = await this.qrCodeService.createDynamicQrForEtablissement(id_etablissement, 30);
//       const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(newQrCode.token);
      
//       return {
//         success: true,
//         message: 'Nouveau QR code dynamique généré pour l\'établissement',
//         data: {
//           id_qrcode: newQrCode.id_qrcode,
//           token: newQrCode.token,
//           date_expiration: newQrCode.date_expiration,
//           qr_code_image: qrCodeImageUrl,
//         }
//       };
//     }
    
//     // Prendre le QR code le plus récent
//     const latestQrCode = activeQrCodes[0];
//     const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(latestQrCode.token);
//     const remainingTime = Math.floor((latestQrCode.date_expiration.getTime() - now.getTime()) / 1000);
    
//     return {
//       success: true,
//       message: 'QR code dynamique de l\'établissement récupéré',
//       data: {
//         id_qrcode: latestQrCode.id_qrcode,
//         token: latestQrCode.token,
//         date_expiration: latestQrCode.date_expiration,
//         remaining_seconds: remainingTime,
//         qr_code_image: qrCodeImageUrl,
//       }
//     };
//   }
  
//   @Post('etablissement/dynamic')
//   @UseGuards(JwtAuthGuard)
//   async generateEtablissementDynamicQrCode(@Req() req, @Body() body: { expiresIn?: number }) {
//     // Vérifier que l'utilisateur est associé à un établissement
//     const id_etablissement = req.user.id_etablissement;
    
//     if (!id_etablissement) {
//       return {
//         success: false,
//         message: 'Vous n\'êtes pas associé à un établissement de santé'
//       };
//     }
    
//     const expiresIn = body.expiresIn || 30; // Par défaut 30 secondes
    
//     // Désactiver les anciens QR codes dynamiques et créer un nouveau
//     const qrCode = await this.qrCodeService.refreshEtablissementDynamicQrCode(id_etablissement, expiresIn);
    
//     // Générer l'URL de l'image QR code
//     const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.token);
    
//     return {
//       success: true,
//       message: 'QR code dynamique généré avec succès pour l\'établissement',
//       data: {
//         id_qrcode: qrCode.id_qrcode,
//         token: qrCode.token,
//         date_expiration: qrCode.date_expiration,
//         qr_code_image: qrCodeImageUrl,
//       }
//     };
//   }
  
//   @Get('etablissement/all')
//   @UseGuards(JwtAuthGuard)
//   async getAllEtablissementQrCodes(@Req() req) {
//     // Vérifier que l'utilisateur est associé à un établissement
//     const id_etablissement = req.user.id_etablissement;
    
//     if (!id_etablissement) {
//       return {
//         success: false,
//         message: 'Vous n\'êtes pas associé à un établissement de santé'
//       };
//     }
    
//     // Mettre à jour le statut des QR codes expirés
//     await this.qrCodeService.updateExpiredQrCodesStatus();
    
//     const allQrCodes = await this.qrCodeService.getAllEtablissementQrCodes(id_etablissement);
    
//     // Ajouter les images QR code
//     const staticQrCodesWithImages = await Promise.all(
//       allQrCodes.static.map(async (qrCode) => {
//         const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.token);
//         return {
//           ...qrCode,
//           qr_code_image: qrCodeImageUrl
//         };
//       })
//     );
    
//     const dynamicQrCodesWithImages = await Promise.all(
//       allQrCodes.dynamic.map(async (qrCode) => {
//         const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.token);
//         return {
//           ...qrCode,
//           qr_code_image: qrCodeImageUrl
//         };
//       })
//     );
    
//     return {
//       success: true,
//       message: 'Tous les QR codes de l\'établissement récupérés',
//       data: {
//         static: staticQrCodesWithImages,
//         dynamic: dynamicQrCodesWithImages
//       }
//     };
//   }
//   */
  
}