import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  async sendOtpSms(phoneNumber: string, otpCode: string): Promise<void> {
    try {
      const message = {
        token: phoneNumber, 
        notification: {
          title: '🔐 Code OTP',
          body: `Votre code OTP est : ${otpCode}`,
        },
      };

      await admin.messaging().send(message);

      console.log(`✅ SMS OTP envoyé à ${phoneNumber} : ${otpCode}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du SMS OTP :', error);
      throw new Error('Échec de l\'envoi du SMS OTP.');
    }
  }
}
