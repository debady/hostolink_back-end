import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // ex: smtp.gmail.com
      port: Number(process.env.SMTP_PORT), // ex: 587
      secure: false, // true pour 465, false pour 587
      auth: {
        user: process.env.SMTP_USER, // ex: sohapigroupcommunication@gmail.com
        pass: process.env.SMTP_PASSWORD, // ton mot de passe
      },
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"Sohapi Group" <${process.env.SMTP_FROM}>`, // Ex: noreply@sohapigroup.com
        to: email, // Destinataire
        subject: 'Votre Code OTP',
        html: `
          <div style="font-family: Arial, sans-serif; font-size: 16px;">
            <p>Bonjour,</p>
            <p>Votre code de vérification (OTP) est :</p>
            <h2 style="color: #2e6c80;">${otp}</h2>
            <p>Ce code expirera dans 5 minutes.</p>
            <p>Merci de votre confiance,<br/>Sohapi Group</p>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email OTP envoyé à ${email} | ID: ${info.messageId}`);
    } catch (error) {
      console.error('❌ Erreur lors de l’envoi de l’email :', error);
      throw new InternalServerErrorException('Erreur lors de l’envoi de l’email');
    }
  }
}
