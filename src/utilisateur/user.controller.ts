import { Controller, Post, Body, BadRequestException, InternalServerErrorException, Get, UseGuards,  Req, 
  Patch, 
  UploadedFile, 
  UseInterceptors, 
  NotFoundException} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CheckUserDto } from './dto/check-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MoyenEnvoiEnum } from './entities/otp.entity';
import { AuthService } from 'src/auth/auth.service';
import { NotificationService } from 'src/module_notification_push/notif_push.service';

interface AuthenticatedRequest extends Request {
  user: { id_user: string };
}

@Controller('api')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
  ) {}

  // ✅ Création d'un utilisateur (sans mot de passe)
  @Post('register-user')
  async registerUser(@Body() checkUserDto: CheckUserDto) {
    try {
      const result = await this.userService.registerUser(checkUserDto.identifier.trim(),checkUserDto.code_invitation_utilise?.trim());
      return { success: result.success, id_user: result.id_user, message: result.message };
    } catch (error) {
      console.error('❌ Erreur register-user:', error);
      throw new InternalServerErrorException(error.message || "Erreur lors de l'inscription");
    }
  }


@Post('define-password')
async definePassword(@Body() registerUserDto: RegisterUserDto) {
  let identifier = registerUserDto.identifier?.trim();
  const password = registerUserDto.password?.trim();

  if (!identifier || !password) {
    throw new BadRequestException('Identifiant et mot de passe sont obligatoires');
  }

  // ✅ Formater le numéro pour Twilio (format international)
  if (!identifier.includes('@') && !identifier.startsWith('+')) {
    // Pour la Côte d'Ivoire, ajouter +225
    identifier = '+225' + identifier.replace(/^0/, ''); // Retire le 0 initial
    //console.log(`📱 Numéro formaté: ${identifier}`);
  }

  try {
    const success = await this.userService.setUserPassword(identifier, password);

    if (!success) {
      throw new InternalServerErrorException("Échec de la mise à jour du mot de passe.");
    }

    const moyen: MoyenEnvoiEnum = identifier.includes('@') ? MoyenEnvoiEnum.EMAIL : MoyenEnvoiEnum.SMS;

    //console.log(`🔍 Envoi OTP via ${moyen} à ${identifier}`); // Debug

    const { otp } = await this.userService.generateOtp(identifier, moyen);

    return {
      success: true,
      message: `Mot de passe défini. Un OTP a été envoyé via ${moyen}.`,
      debug: moyen === MoyenEnvoiEnum.SMS ? otp : undefined, // Pour tester
    };

  } catch (error) {
    console.error("❌ Erreur define-password:", error);
    throw new InternalServerErrorException(error.message || "Erreur lors de la mise à jour du mot de passe");
  }
}

    @Post('generate')
    async generateOtp(@Body() body: { identifier: string; moyen_envoyer: MoyenEnvoiEnum }) {
      if (!body.identifier?.trim()) {
        throw new BadRequestException("L'identifiant est requis");
      }
    
      try {
        const moyenEnvoyerFormatted = body.moyen_envoyer.toLowerCase() as MoyenEnvoiEnum;
        //console.log(`📩 Génération OTP pour ${body.identifier} via ${moyenEnvoyerFormatted}`);
    
        const { otp } = await this.userService.generateOtp(body.identifier.trim(), moyenEnvoyerFormatted);
    
        // 🔵 Si c'est un téléphone ➔ afficher simplement le code
        if (moyenEnvoyerFormatted === MoyenEnvoiEnum.SMS || moyenEnvoyerFormatted === MoyenEnvoiEnum.TELEPHONE) {
          return {
            success: true,
            message: "OTP généré avec succès (affiché uniquement en mode SMS)",
            moyen: moyenEnvoyerFormatted,
            otp, // ✅ affiché dans la réponse
          };
        }else{
    
        // 🟣 Email → envoyer normalement (tu peux garder l’envoi réel si tu veux)
        return {
          success: true,
          message: "OTP envoyé par email avec succès",
          moyen: moyenEnvoyerFormatted,
          otp
        };
        }
      } catch (error) {
        console.error("❌ Erreur generate-otp:", error);
        throw new InternalServerErrorException(error.message || "Erreur lors de la génération de l'OTP");
      }
    }


  // ✅ Vérification du PIN de connexion
  @Post('verify-pin')
    async verifyPin(@Body() body: { identifier: string; pin: string }) {
      if (!body.identifier?.trim() || !body.pin?.trim()) {
        throw new BadRequestException('Identifiant et PIN requis');
      }

      try {
        const isValid = await this.userService.verifyUserPin(
          body.identifier.trim(), 
          body.pin.trim()
        );
        
        return isValid 
          ? { success: true, message: 'PIN valide' } 
          : { success: false, message: 'PIN incorrect' };
      } catch (error) {
        console.error("❌ Erreur verify-pin:", error);
        throw new InternalServerErrorException("Erreur lors de la vérification du PIN");
      }
  }
  
  @Post('verify')
  async verifyOtp(@Body() body: { identifier: string; otpCode: string }) {
    if (!body.identifier?.trim() || !body.otpCode?.trim()) {
      throw new BadRequestException("Identifiant et code OTP requis");
    }
  
    try {
      const identifier = body.identifier.trim();
      const otpCode = body.otpCode.trim();
  
      //console.log(`📩 Vérification OTP pour ${identifier}`);
  
      const result = await this.userService.verifyOtp(identifier, otpCode);
  
      if (!result.success) return result;
  
      const user = await this.userService.findUserByIdentifier(identifier);
      if (!user) throw new NotFoundException("Utilisateur introuvable.");
  
      const token = await this.authService.generateJwtTokenFromUser(user);
  
      return {
        success: true,
        message: result.message,
        token, 
      };
    } catch (error) {
      console.error("❌ Erreur verify-otp:", error);
      return { success: false, message: "Échec de la vérification de l'OTP" };
    }
  }


  // ✅ Récupérer les infos de l'utilisateur connecté
  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.getUserById(req.user.id_user);
    
    return {
      success: true,
      data: user,
    };
  }
  
  @Patch('/update-profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Req() req: AuthenticatedRequest, 
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const id_user = req.user.id_user; 
    //console.log('🟢 Image reçue:', file ? file.originalname : 'Aucune image reçue');
    //console.log('🔵 id_user extrait du token:', id_user);
  
    return await this.userService.updateUserProfile(id_user, updateProfileDto, file);
  }
  

// ✅ Récupérer tous les emails dans la bd
@Get('all-emails')
@UseGuards(JwtAuthGuard)
async getAllEmails(@Req() req: AuthenticatedRequest) {
  return await this.userService.getAllEmails();
}

// ✅ Récupérer tous les téléphones dans la bd
@Get('all-telephones')
@UseGuards(JwtAuthGuard)
async getAllTelephones(@Req() req: AuthenticatedRequest) {
  return await this.userService.getAllTelephones();
}

    // ✅ Vérifier si un email ou numéro existe
    @Post('check-identifier')
    @UseGuards(JwtAuthGuard)
    async checkIdentifier(@Req() req: AuthenticatedRequest, @Body() body: { identifier: string }) {
      if (!body.identifier?.trim()) {
        throw new BadRequestException("Identifiant requis.");
      }

      const user = await this.userService.findUserByIdentifier(body.identifier.trim());
      if (user) {
        return { success: true, message: "Identifiant trouvé", data: user };
      } else {
        return { success: false, message: "Identifiant non trouvé" };
    
  }
    }



  
    @Post('creer-compte-complet')
    async createFullUser(@Body() body: {
      email?: string;
      telephone?: string;
      mdp: string;
      nom?: string;
      prenom?: string;
      pays?: string;
      position?: string;
      fcm_token?: string;
      code_invitation_utilise?: string;
    }) {
      let parsedPosition: { longitude: number; latitude: number } | undefined = undefined;
      if (body.position) {
        try {
          parsedPosition = typeof body.position === 'string' ? JSON.parse(body.position) : undefined;
        } catch (e) {
          throw new BadRequestException('Position doit être un objet JSON valide avec longitude et latitude.');
        }
      }

      // Vérifier que l'email est fourni
      if (!body.email || !body.email.trim()) {
        throw new BadRequestException('L\'email est requis pour créer un compte.');
      }

      const identifier = body.email.trim();

      // Création de l'utilisateur
      const user = await this.userService.createFullUser({
        ...body,
        email: identifier,
        position: parsedPosition,
      });

      // Générer et envoyer l'OTP uniquement par email
      const { otp } = await this.userService.generateOtp(identifier, MoyenEnvoiEnum.EMAIL);

      return {
        success: true,
        message: `Compte créé avec succès. Un OTP a été envoyé à votre adresse email.`,
        id_user: user?.id_user,
        otp, 
      };
    }


    // ENDPOINT DE RECUP DU DERNIER OTP DE L'UTILISATEUR PAR SMS
    @Post('get-otp')
    async getOtp(@Body() body: { identifier: string }) {
      if (!body.identifier?.trim()) {
        throw new BadRequestException("Identifiant requis.");
      }
      return await this.userService.getLastOtpByIdentifier(body.identifier.trim());
    }

    // @Post('get-otp')
    //   async getOtp(
    //     @Body() body: { identifier: string; token: string } // on attend token FCM ici
    //   ) {
    //     if (!body.identifier?.trim()) {
    //       throw new BadRequestException("Identifiant requis.");
    //     }
    //     if (!body.token?.trim()) {
    //       throw new BadRequestException("Token notification requis.");
    //     }

    //     const result = await this.userService.getLastOtpByIdentifier(body.identifier.trim());

    //     // Préparer le message de notification
    //     let title = '';
    //     let message = '';
    //     if (result.success) {
    //       title = 'Code OTP';
    //       message = `Votre code OTP est : ${result.otp}`;
    //     } else {
    //       title = 'Erreur OTP';
    //       message = result.message;
    //     }

    //     // Envoyer la notif push
    //     try {
    //       await this.notificationService.sendToToken(body.token.trim(), title, message);
    //     } catch (error) {
    //       // Optionnel : logger ou gérer l’erreur notification sans bloquer la réponse
    //       console.error('Erreur envoi notification:', error.message);
    //     }

    //     return result;
    //   }


          //notifications
    @UseGuards(JwtAuthGuard)
    @Post('update-fcm-token')
    async updateFcmToken(@Req() req, @Body('fcm_token') fcm_token: string) {
      const userId = req.user.id_user;
      return this.userService.updateFcmToken(userId, fcm_token);
    }


    @Post('public/update-fcm-token-temp')
    async updateFcmTokenPublic(@Body() body: { id_user: string; fcm_token: string }) {
      const { id_user, fcm_token } = body;
      if (!id_user || !fcm_token) {
        throw new BadRequestException("id_user et fcm_token sont requis");
      }

      const user = await this.userService.findUserById(id_user);
      if (!user) {
        throw new NotFoundException("Utilisateur introuvable");
      }

      return this.userService.updateFcmToken(id_user, fcm_token);
    }
    


// inscription direct de l'utilisateur 
    // @Post('creer-compte-complet')
    // async createFullUser(@Body() body: {
    //     // 

    //   email?: string;
    //   telephone?: string;
    //   mdp: string;
    //   nom?: string;
    //   prenom?: string;
    //   pays?: string;
    //   position?: string;
    //   fcm_token?: string;
    //   code_invitation_utilise?: string;
    // }) {
    //   let parsedPosition: { longitude: number; latitude: number } | undefined = undefined;
    //   if (body.position) {
    //     try {
    //       // Suppose position is a JSON string like '{"longitude":5.3,"latitude":7.1}'
    //       parsedPosition = typeof body.position === 'string' ? JSON.parse(body.position) : undefined;
    //     } catch (e) {
    //       throw new BadRequestException('Position doit être un objet JSON valide avec longitude et latitude.');
    //     }
    //   }

    //     // Déterminer l'identifiant et le moyen d'envoi
    //     // const identifier = body.email ? body.email.trim() : body.telephone?.trim();
    //     // if (!identifier) {
    //     //   throw new BadRequestException('Email ou téléphone requis pour générer un OTP.');
    //     // }
    //     // const moyen: MoyenEnvoiEnum = body.email ? MoyenEnvoiEnum.EMAIL : MoyenEnvoiEnum.SMS;
    //     // //console.log(`🔍 Envoi OTP via ${moyen} à ${identifier}`); // Debug
    //     // const { otp } = await this.userService.generateOtp(identifier, moyen);
      
    //   return this.userService.createFullUser({
    //     ...body,
    //     position: parsedPosition,
    //     // otp
    //   });
    // }

     // ✅ Création d'un utilisateur avec code d'invitation (si fourni)
    // @Post('check-user')
    //   async checkUser(@Body() body: { identifier: string; code_invitation_utilise?: string }) {
    //     return this.userService.registerUser(
    //       body.identifier.trim(),
    //       body.code_invitation_utilise?.trim() // ← C’EST ICI QUE ÇA PEUT ÊTRE VIDE
    //     );
    // }

    // @Post('verify-otp-bonus')
    //   async verifyOtpAndReward(@Body() body: { identifier: string; otpCode: string }) {
    //   if (!body.identifier?.trim() || !body.otpCode?.trim()) {
    //     throw new BadRequestException("Identifiant et code OTP requis");
    // }

    //   try {
    //     const result = await this.userService.verifyOtpAndRewardParrain(
    //       body.identifier.trim(),
    //       body.otpCode.trim()
    //     );
    //     return result;
    //   } catch (error) {
    //     console.error("❌ Erreur verify-otp-bonus:", error);
    //     throw new InternalServerErrorException(error.message || "Erreur lors de la vérification OTP + bonus");
    //   }
    // }
    // }



}
