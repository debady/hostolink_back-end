import { Injectable } from '@nestjs/common';
import { Vonage } from '@vonage/server-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SmsService {
  private vonage: Vonage;

  constructor() {
    const apiKey = process.env.VONAGE_API_KEY;
    const apiSecret = process.env.VONAGE_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('🚨 Les clés API Vonage ne sont pas définies dans .env');
    }

    this.vonage = new Vonage({
      apiKey,
      apiSecret,
    } as any); // ✅ Solution TypeScript (force le typage)
  }

  async sendOtpSms(to: string, otp: string): Promise<boolean> {
    try {
      const from = process.env.VONAGE_FROM || 'Vonage';
      const text = `Votre code OTP est : ${otp}`;

      const response = await this.vonage.sms.send({
        to,
        from,
        text,
      });

      console.log('✅ SMS envoyé avec succès:', response);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de l’envoi du SMS:', error);
      return false;
    }
  }
}

