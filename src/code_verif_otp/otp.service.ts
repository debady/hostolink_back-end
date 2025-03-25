
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../utilisateur/entities/user.entity';
import { MoyenEnvoiEnum, Otp } from './entities/otp.entity';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class OtpService {
  emailService: any;
  sendOtp(_arg0: { identifier: any; }) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly smsService: SmsService,
  ) {}

  async generateOtp(identifier: string, moyen_envoyer: MoyenEnvoiEnum): Promise<{ success: boolean; otp: string }> {
    try {
      identifier = identifier.trim();
      const user = await this.userRepository.findOne({
        where: [{ email: identifier }, { telephone: identifier }],
      });
  
      if (!user) {
        console.error(`❌ Échec : Utilisateur non trouvé pour ${identifier}`);
        throw new BadRequestException("Utilisateur non trouvé");
      }
  
      // ✅ Générer un OTP (4 à 6 chiffres)
      const otpCode = Math.floor(1000 + Math.random() * 900).toString();
  
      // ✅ Définir l'expiration à 5 minutes
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 5);

      await this.otpRepository.createQueryBuilder()
      .delete()
      .from(Otp)
      .where("id_user = :id_user", {
        id_user: user ? user.id_user : null,
      })
      .execute();

      // a dev admin
        // const otp = this.otpRepository.create({
        //   otp_code: otpCode,
        //   expires_at: expirationDate,
        //   is_valid: true,
        //   moyen_envoyer: moyen_envoyer,
        //   id_user: user ? user.id_user : undefined,
        // });

        const otp = this.otpRepository.create({
          otp_code: otpCode,
          expires_at: expirationDate,
          is_valid: true,
          moyen_envoyer: moyen_envoyer,
          // user: user ?? null, // ou simplement user si toujours défini
        });
        
        
      await this.otpRepository.save(otp);

      if (moyen_envoyer === MoyenEnvoiEnum.SMS && identifier) {

        await this.smsService.sendOtpSms(identifier, otpCode);
        console.log(`📤 Envoi du SMS en cours vers ${Number} avec l'OTP ${otpCode}`);

      } else if (moyen_envoyer === MoyenEnvoiEnum.EMAIL && identifier) {

        // await this.emailService.sendOtpEmail(identifier, otpCode);
        console.log("code envoyer par email à dev")
      }

      console.log(`✅ Envoi d'un OTP à ${identifier} via ${moyen_envoyer}`);
      console.log(`📤 OTP envoyer à ${identifier} est ${otpCode}`);
      return { success: true, otp: otpCode };

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Erreur lors de la génération de l'OTP");
    }
  }
  

  // verif otp
  async verifyOtp(identifier: string, otpCode: string): Promise<{ success: boolean; message: string }> {
    try {
      identifier = identifier.trim();
      otpCode = otpCode.trim();

      const user = await this.userRepository.findOne({
        where: [{ email: identifier }, { telephone: identifier }],
      });

      const otp = await this.otpRepository.findOne({
        where: [
          ...(user ? [{ user: user, otp_code: otpCode, is_valid: true }] : []),
        ],
        relations: ['user'],
      });
      
      if (!otp || new Date() > otp.expires_at) {
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