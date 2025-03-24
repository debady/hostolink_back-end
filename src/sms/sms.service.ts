import { Injectable } from '@nestjs/common';
import { Vonage } from '@vonage/server-sdk';
import { Auth } from '@vonage/auth';

@Injectable()
export class SmsService {
  private vonage: Vonage;

  constructor() {
    const credentials = new Auth({
      apiKey: process.env.VONAGE_API_KEY || '',
      apiSecret: process.env.VONAGE_API_SECRET || '',
    });

    this.vonage = new Vonage(credentials);
  }

  async sendOtpSms(otp: string, otpCode: string): Promise<void> {
    const phoneNumber = '+2250544704854';
    const from = 'HostoLink';
    const text = `Votre code OTP est : ${otp}`;

    try {
      const response = await this.vonage.sms.send({
        to: phoneNumber,
        from,
        text,
      });

      console.log('📩 SMS envoyé avec succès :', response);
    } catch (error) {
      console.error('❌ Erreur lors de l’envoi du SMS:', error);
    }
  }
}
