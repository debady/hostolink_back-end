import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();


dotenv.config();

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendOtpEmail(email: string, otp: string) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Votre code OTP - Hostolink',
      text: `Votre code OTP est : ${otp}. Il expire dans 5 minutes.`,
      html: `<p>Votre code OTP est : <strong>${otp}</strong>. Il expire dans <strong>5 minutes</strong>.</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email OTP envoyé à ${email}`);
    } catch (error) {
      console.error("❌ Erreur d'envoi d'email :", error);
      throw new Error("Erreur lors de l'envoi de l'email OTP");
    }
  }

  async testSendEmail() {
    const testEmail = "debadychatue@gmail.com"; 
    const otpCode = "8945";
    await this.sendOtpEmail(testEmail, otpCode);
  }
  
}
