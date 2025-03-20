
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../utilisateur/entities/user.entity';
import { MoyenEnvoiEnum, Otp } from './entities/otp.entity';
import { EmailService } from '../notifications/email.service';
import { SmsService } from '../notifications/sms.service';
import { response } from 'express';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly emailService: EmailService,

    private readonly smsService: SmsService,
  ) {}

  // ✅ Générer un OTP
  async generateOtp(identifier: string, moyen_envoyer: MoyenEnvoiEnum): Promise<{ success: boolean; otp: string }> {
    try {
      identifier = identifier.trim();
      console.log(`📩 Tentative de génération d'OTP pour : ${identifier} via ${moyen_envoyer}`);
  
      // ✅ Vérifier si l'utilisateur existe
      const user = await this.userRepository.findOne({
        where: [{ email: identifier }, { telephone: identifier }],
      });
  
      if (!user) {
        console.error(`❌ Échec : Utilisateur non trouvé pour ${identifier}`);
        throw new BadRequestException("Utilisateur non trouvé");
      }

      // ✅ Vérifier si un OTP a déjà été envoyé récemment (limite de 2 minutes)
      if (user.dernier_otp_envoye) {
        const dernierOtp = new Date(user.dernier_otp_envoye).getTime();
        const maintenant = new Date().getTime();
        const tempsEcoule = maintenant - dernierOtp;
        
        if (tempsEcoule < 2 * 60 * 1000) {
          const tempsRestant = Math.ceil((120000 - tempsEcoule) / 1000);
          console.warn(`⏱️ Dernière demande d'OTP trop récente. Attente requise: ${tempsRestant} secondes`);
          throw new BadRequestException(`Trop de demandes d'OTP. Attendez encore ${tempsRestant} secondes.`);
        }
      }
  
      // ✅ Générer un OTP (6 chiffres)
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  
      // ✅ Définir l'expiration à 5 minutes
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 5);
      console.log(`🕒 OTP généré à ${new Date().toISOString()}, expire à: ${expirationDate.toISOString()}`);
  
      console.log(`🔄 Suppression des anciens OTPs pour l'utilisateur ${user.id_user}`);
  
      // ✅ Supprimer tous les OTPs précédents de cet utilisateur
      await this.otpRepository.createQueryBuilder()
        .delete()
        .from(Otp)
        .where("id_user = :id_user", { id_user: user.id_user })
        .execute();
  
      console.log(`✅ Ancien(s) OTP supprimé(s). Enregistrement du nouvel OTP...`);
  
      // ✅ Enregistrer le nouvel OTP
      const otp = this.otpRepository.create({
        user: user,
        otp_code: otpCode,
        expires_at: expirationDate,
        is_valid: true,
        moyen_envoyer: moyen_envoyer,
      });
  
      await this.otpRepository.save(otp);

      // ✅ Mettre à jour la date du dernier OTP envoyé
      user.dernier_otp_envoye = new Date();
      await this.userRepository.save(user);

      // ✅ Envoi de l'OTP selon le moyen choisi
      if (moyen_envoyer === MoyenEnvoiEnum.TELEPHONE) {
        if (user.telephone) {
          try {
            await this.smsService.sendOtpSms(user.telephone, otpCode);
            console.log(`✅ SMS OTP envoyé à ${user.telephone}`);
          } catch (error) {
            console.error(`❌ Erreur lors de l'envoi du SMS OTP:`, error);
            throw new InternalServerErrorException("Erreur lors de l'envoi du SMS OTP");
          }
        } else {
          console.error(`❌ Erreur : Impossible d'envoyer l'OTP par SMS, l'utilisateur ${identifier} n'a pas de numéro de téléphone.`);
          throw new BadRequestException("Numéro de téléphone manquant pour l'envoi de l'OTP");
        }
      } else if (moyen_envoyer === MoyenEnvoiEnum.EMAIL) {
        if (user.email) {
          try {
            await this.emailService.sendOtpEmail(user.email, otpCode);
            console.log(`✅ Email OTP envoyé à ${user.email}`);
          } catch (error) {
            console.error(`❌ Erreur lors de l'envoi de l'email OTP:`, error);
            throw new InternalServerErrorException("Erreur lors de l'envoi de l'email OTP");
          }
        } else {
          console.error(`❌ Erreur : Impossible d'envoyer l'OTP, l'utilisateur ${identifier} n'a pas d'email.`);
          throw new BadRequestException("Email manquant pour l'envoi de l'OTP");
        }
      }

      console.log(`✅ OTP généré avec succès pour ${identifier} : ${otpCode}`);
      return { success: true, otp: otpCode };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error("❌ Erreur lors de la génération de l'OTP :", error);
      throw new InternalServerErrorException("Erreur lors de la génération de l'OTP");
    }
  }
  
  // ✅ Vérifier un OTP
  async verifyOtp(identifier: string, otpCode: string): Promise<{ success: boolean; message: string }> {
    try {
      identifier = identifier.trim();
      otpCode = otpCode.trim();

      console.log(`📩 Vérification OTP pour ${identifier}, code saisi : ${otpCode}`);

      // Vérifie si l'utilisateur existe
      const user = await this.userRepository.findOne({
        where: [{ email: identifier }, { telephone: identifier }],
      });

      if (!user) {
        console.error(`❌ Échec : Utilisateur non trouvé pour ${identifier}`);
        throw new BadRequestException("Utilisateur non trouvé");
      }

      // Récupérer l'OTP valide le plus récent
      const otp = await this.otpRepository.findOne({
        where: { 
          user: { id_user: user.id_user }, 
          otp_code: otpCode, 
          is_valid: true 
        },
        relations: ['user'],
        order: { expires_at: 'DESC' }
      });

      if (!otp) {
        console.warn(`❌ Code OTP invalide ou non trouvé pour ${identifier}`);
        return { success: false, message: "Code OTP incorrect ou expiré" };
      }

      // Logs pour déboguer
      const now = new Date();
      console.log(`🕒 Heure actuelle: ${now.toISOString()}`);
      console.log(`🕒 Heure d'expiration de l'OTP: ${otp.expires_at.toISOString()}`);
      
      // Vérifier si l'OTP est expiré
      if (now.getTime() > new Date(otp.expires_at).getTime()) {
        otp.is_valid = false;
        await this.otpRepository.save(otp);
        
        const diffMs = now.getTime() - new Date(otp.expires_at).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        
        console.warn(`❌ Code OTP expiré pour ${identifier}. Expiré depuis ${diffMins}min ${diffSecs}s`);
        return { success: false, message: "Code OTP expiré" };
      }

      // Marquer l'OTP comme utilisé (désactivation)
      otp.is_valid = false;
      await this.otpRepository.save(otp);

      console.log(`✅ Code OTP validé avec succès pour ${identifier}`);
      return { success: true, message: "Code OTP valide" };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error("❌ Erreur lors de la vérification de l'OTP :", error);
      throw new InternalServerErrorException("Erreur lors de la vérification de l'OTP");
    }
  }
}