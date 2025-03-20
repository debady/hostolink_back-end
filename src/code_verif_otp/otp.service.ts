import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../utilisateur/entities/user.entity';
import { MoyenEnvoiEnum, Otp } from './entities/otp.entity';
import { EmailService } from '../notifications/email.service';
import { SmsService } from '../notifications/sms.service';

@Injectable()
export class OtpService {
  sendOtp(arg0: { identifier: any; }) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  async generateOtp(identifier: string, moyen_envoyer: MoyenEnvoiEnum): Promise<{ success: boolean; otp: string }> {
    try {
      identifier = identifier.trim();
      console.log(`📩 Génération d'OTP pour : ${identifier} via ${moyen_envoyer}`);

      const user = await this.userRepository.findOne({
        where: [{ email: identifier }, { telephone: identifier }],
      });

      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + 5);

      await this.otpRepository.createQueryBuilder()
      .delete()
      .from(Otp)
      .where("id_user = :id_user", {
        id_user: user ? user.id_user : null,
      })
      .execute();


        const otp = this.otpRepository.create({
          otp_code: otpCode,
          expires_at: expirationDate,
          is_valid: true,
          moyen_envoyer: moyen_envoyer,
          id_user: user ? user.id_user : undefined,
        });
        
        
      await this.otpRepository.save(otp);

      if (moyen_envoyer === MoyenEnvoiEnum.TELEPHONE && identifier) {
        await this.smsService.sendOtpSms(identifier, otpCode);

      } else if (moyen_envoyer === MoyenEnvoiEnum.EMAIL && identifier) {
        await this.emailService.sendOtpEmail(identifier, otpCode);
      }

      console.log(`✅ Envoi d'un OTP à ${identifier} via ${moyen_envoyer}`);

      return { success: true, otp: otpCode };
    } catch (error) {
      throw new InternalServerErrorException("Erreur lors de la génération de l'OTP");
    }
  }

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

      otp.is_valid = false;
      await this.otpRepository.save(otp);

      return { success: true, message: "Code OTP validé" };
    } catch (error) {
      throw new InternalServerErrorException("Erreur lors de la vérification de l'OTP");
    }
  }
}
