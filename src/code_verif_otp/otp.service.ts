
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../utilisateur/entities/user.entity';
import { MoyenEnvoiEnum, Otp } from './entities/otp.entity';
<<<<<<< HEAD
import { EmailService } from '../notifications/email.service';
import { SmsService } from '../notifications/sms.service';
import { response } from 'express';
=======
import { SmsService } from '../firebase_notifications/sms.service';
>>>>>>> 6f4439418bd059065ab6f03f91af07e745c9672d

@Injectable()
export class OtpService {
  sendOtp(_arg0: { identifier: any; }) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    // private readonly emailService: EmailService,
    private readonly smsService: SmsService,


  ) {}

  async generateOtp(identifier: string, moyen_envoyer: MoyenEnvoiEnum): Promise<{ success: boolean; otp: string }> {
    try {
      identifier = identifier.trim();
      console.log(`📩 Génération d'OTP pour : ${identifier} via ${moyen_envoyer}`);

      const user = await this.userRepository.findOne({
        where: [{ email: identifier }, { telephone: identifier }],
      });
  
      if (!user) {
        console.error(`❌ Échec : Utilisateur non trouvé pour ${identifier}`);
        throw new BadRequestException("Utilisateur non trouvé");
      }
  
      // ✅ Générer un OTP (4 à 6 chiffres)
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
      // ✅ Définir l'expiration à 5 minutes
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 5);

      await this.otpRepository.createQueryBuilder()
<<<<<<< HEAD
        .delete()
        .from(Otp)
        .where("id_user = :id_user AND is_valid = true", { id_user: user.id_user })
        .execute();
  
      console.log(`✅ Ancien(s) OTP supprimé(s). Enregistrement du nouvel OTP...`);
  
      // ✅ Enregistrer le nouvel OTP
      const otp = this.otpRepository.create({
        user: user,  // ✅ Assure la bonne relation
        otp_code: otpCode,
        expires_at: expirationDate,
        is_valid: true,
        moyen_envoyer: moyen_envoyer, // ✅ Suppression du `.toLowerCase()`
      });
  
      await this.otpRepository.save(otp);

      if (moyen_envoyer === MoyenEnvoiEnum.TELEPHONE) {
        if (user.telephone) {
          await this.smsService.sendOtpSms(user.telephone, otpCode);
          console.log(`✅ SMS OTP envoyé à ${user.telephone}`);
          console.log("📌 Réponse Vonage :", JSON.stringify(response, null, 2));

        } else {
          console.error(`❌ Erreur : Impossible d'envoyer l'OTP par SMS, l'utilisateur ${identifier} n'a pas de numéro de téléphone.`);
        }
      }
      

      // ✅ Mettre à jour la date du dernier OTP envoyé
      const maintenant = new Date();
     // ✅ Mettre à jour la date du dernier OTP envoyé si l'utilisateur existe
        if (user) {
          user.dernier_otp_envoye = new Date();
          await this.userRepository.update(user.id_user, { dernier_otp_envoye: () => `'${new Date().toISOString()}'` });
        }

      


      // ✅ ENVOI DE L'OTP PAR EMAIL SI `EMAIL` EST CHOISI
      if (moyen_envoyer === MoyenEnvoiEnum.EMAIL) {
        try {
          if (moyen_envoyer === MoyenEnvoiEnum.EMAIL && user.email) {
            try {
              await this.emailService.sendOtpEmail(user.email, otpCode);
              console.log(`✅ Email OTP envoyé à ${user.email}`);
            } catch (error) {
              console.error(`❌ Erreur lors de l'envoi de l'email OTP à ${user.email} :`, error);
            }
          } else if (moyen_envoyer === MoyenEnvoiEnum.EMAIL && !user.email) {
            console.error(`❌ Erreur : Impossible d'envoyer l'OTP, l'utilisateur ${identifier} n'a pas d'email.`);
          }
          
          
          console.log(`✅ Email OTP envoyé à ${user.email}`);
        } catch (error) {
          console.error("❌ Erreur lors de l'envoi de l'email OTP :", error);
        }
=======
      .delete()
      .from(Otp)
      .where("id_user = :id_user", {
        id_user: user ? user.id_user : null,
      })
      .execute();

      // a dev admin
        const otp = this.otpRepository.create({
          otp_code: otpCode,
          expires_at: expirationDate,
          is_valid: true,
          moyen_envoyer: moyen_envoyer,
          id_user: user ? user.id_user : undefined,
        });
        
      await this.otpRepository.save(otp);

      if (moyen_envoyer === MoyenEnvoiEnum.SMS && identifier) {
        await this.smsService.sendOtpSms(identifier, otpCode);
        console.log(`📤 Envoi du SMS en cours vers ${Number} avec l'OTP ${otpCode}`);


      } else if (moyen_envoyer === MoyenEnvoiEnum.EMAIL && identifier) {
        // await this.emailService.sendOtpEmail(identifier, otpCode);
        console.log("code envoyer par email à dev")
>>>>>>> 6f4439418bd059065ab6f03f91af07e745c9672d
      }

  
      console.log(`✅ OTP généré avec succès pour ${identifier} : ${otpCode}`);
  
      return { success: true, otp: otpCode };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Erreur lors de la génération de l'OTP");
    }
  }
  

<<<<<<< HEAD
  // ✅ Vérifier un OTP
=======
  // verif otp
>>>>>>> 6f4439418bd059065ab6f03f91af07e745c9672d
  async verifyOtp(identifier: string, otpCode: string): Promise<{ success: boolean; message: string }> {
    try {
      identifier = identifier.trim();
      otpCode = otpCode.trim();

      const user = await this.userRepository.findOne({
        where: [{ email: identifier }, { telephone: identifier }],
      });

<<<<<<< HEAD
      // // ✅ Vérifier si un OTP a déjà été envoyé récemment (limite de 2 minutes)
      // const maintenant = new Date();
      // if (user && user.dernier_otp_envoye) {
      //   const dernierOtp = new Date(user.dernier_otp_envoye).getTime();
      //   const tempsEcoule = new Date().getTime() - dernierOtp;
        
      //   if (tempsEcoule < 2 * 60 * 1000) {
      //     throw new BadRequestException(`Trop de demandes d'OTP. Attendez encore ${Math.ceil((120000 - tempsEcoule) / 1000)} secondes.`);
      //   }
      // }
      
      


      if (!user) {
        console.error(`❌ Échec : Utilisateur non trouvé pour ${identifier}`);
        throw new BadRequestException("Utilisateur non trouvé");
      }

      // ✅ Récupérer l'OTP valide et non expiré
=======
>>>>>>> 6f4439418bd059065ab6f03f91af07e745c9672d
      const otp = await this.otpRepository.findOne({
        where: [
          ...(user ? [{ user: user, otp_code: otpCode, is_valid: true }] : []),
        ],
        relations: ['user'],
      });
      
<<<<<<< HEAD

      if (!otp) {
        console.warn(`❌ Code OTP invalide ou expiré pour ${identifier}`);
=======
      if (!otp || new Date() > otp.expires_at) {
>>>>>>> 6f4439418bd059065ab6f03f91af07e745c9672d
        return { success: false, message: "Code OTP incorrect ou expiré" };
      }

      // ✅ Vérifier si l'OTP est expiré
      if (new Date() > otp.expires_at) {
        otp.is_valid = false;
        await this.otpRepository.save(otp);
        console.warn(`❌ Code OTP expiré pour ${identifier}`);
        return { success: false, message: "Code OTP expiré" };
      }

      // ✅ Marquer l'OTP comme utilisé (désactivation)
      otp.is_valid = false;
      await this.otpRepository.save(otp);

      console.log(`✅ Code OTP validé avec succès pour ${identifier}`);

      return { success: true, message: "Code OTP valide" };
    } catch (error) {
      console.error("❌ Erreur lors de la vérification de l'OTP :", error);
      throw new InternalServerErrorException("Erreur lors de la vérification de l'OTP");
    }
  }
}