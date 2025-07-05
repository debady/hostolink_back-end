import { Injectable, InternalServerErrorException } from '@nestjs/common';
import twilio from 'twilio';

@Injectable()
export class SmsService {
  private client: twilio.Twilio;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      throw new InternalServerErrorException('❌ Twilio SID ou Auth Token manquant dans .env');
    }

    this.client = twilio(accountSid, authToken);
  }

  async sendOtpSms(phoneNumber: string, otpCode: string): Promise<void> {
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  
  //console.log(`🔍 Tentative SMS vers: ${phoneNumber}`);
  //console.log(`🔍 Depuis le numéro: ${fromNumber}`);
  
  try {
    const message = await this.client.messages.create({
      body: `Akwaba, Voici le code de vérification: ${otpCode}. Valable 5 min.`,
      from: fromNumber,
      to: phoneNumber,
    });

    setTimeout(async () => {
  const finalMessage = await this.client.messages(message.sid).fetch();
  //console.log(`📊 Statut final: ${finalMessage.status}`);
  if (finalMessage.errorCode) {
    console.error(`❌ Erreur Twilio: ${finalMessage.errorCode} - ${finalMessage.errorMessage}`);
  }
}, 5000);

    

    
    
    //console.log(`✅ SMS envoyé! SID: ${message.sid}, Status: ${message.status}`);
  } catch (error) {
    console.error('❌ Détail erreur Twilio:', error.message);
    console.error('❌ Code erreur:', error.code);
    throw new InternalServerErrorException(`Twilio Error: ${error.message}`);
  }
}
}
