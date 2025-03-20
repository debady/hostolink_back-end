import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Vonage } from '@vonage/server-sdk';
import { Auth } from '@vonage/auth';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SmsService {
  private vonage: Vonage;

  constructor() {
    const apiKey = process.env.VONAGE_API_KEY;
    const apiSecret = process.env.VONAGE_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error("❌ Clés API Vonage manquantes. Vérifiez votre fichier .env.");
    }

    const credentials = new Auth({
      apiKey: apiKey,
      apiSecret: apiSecret,
    });

    this.vonage = new Vonage(credentials);
  }

  async sendOtpSms(to: string, otpCode: string): Promise<void> {
    const from = process.env.VONAGE_SMS_SENDER || 'Vonage';

    try {
      console.log(`📩 Envoi de l'OTP ${otpCode} à ${to} via SMS...`);

      const response = await this.vonage.sms.send({
        to,
        from,
        text: `Votre code OTP est : ${otpCode}. Il expire dans 5 minutes.`,
      });

      if (response.messages[0].status !== '0') {
        throw new InternalServerErrorException(
          `Erreur Vonage: ${response.messages[0]['error-text']}`,
        );
      }

      console.log(`✅ SMS OTP envoyé avec succès à ${to}`);
    } catch (error) {
      console.error('❌ Erreur lors de l’envoi du SMS OTP:', error);
      throw new InternalServerErrorException('Échec de l’envoi du SMS OTP');
    }
  }
}
