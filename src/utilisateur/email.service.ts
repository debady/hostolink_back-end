// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class EmailService {
//   private transporter: nodemailer.Transporter;

//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST, // ex: smtp.gmail.com
//       port: Number(process.env.SMTP_PORT), // ex: 587
//       secure: false, // true pour 465, false pour 587
//       auth: {
//         user: process.env.SMTP_USER, // ex: sohapigroupcommunication@gmail.com
//         pass: process.env.SMTP_PASSWORD, // ton mot de passe
//       },
//     });
//   }

//   async sendOtpEmail(email: string, otp: string): Promise<void> {
//     try {
//       const mailOptions = {
//         from: `"Sohapi Group" <${process.env.SMTP_FROM}>`, // Ex: noreply@sohapigroup.com
//         to: email, // Destinataire
//         subject: 'Votre Code OTP',
//         html: `
//           <div style="font-family: Arial, sans-serif; font-size: 16px;">
//             <p>Bonjour,</p>
//             <p>Votre code de vérification (OTP) est :</p>
//             <h2 style="color: #2e6c80;">${otp}</h2>
//             <p>Ce code expirera dans 5 minutes.</p>
//             <p>Merci de votre confiance,<br/>Sohapi Group</p>
//           </div>
//         `,
//       };

//       const info = await this.transporter.sendMail(mailOptions);
//       console.log(`✅ Email OTP envoyé à ${email} | ID: ${info.messageId}`);
//     } catch (error) {
//       console.error('❌ Erreur lors de l’envoi de l’email :', error);
//       throw new InternalServerErrorException('Erreur lors de l’envoi de l’email');
//     }
//   }
// }



import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"Explora Studio" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: '🔐 Code de vérification - Hostolink',
        html: `
          <div style="max-width:600px;margin:auto;padding:20px;font-family:'Arial',sans-serif;background:#f9f9f9;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align:center;">
              <img src="https://res.cloudinary.com/dhrrk7vsd/image/upload/v1740668911/hostolink/axdjirzolotfs3sjrb2v.jpg" alt="Hostolink Banner" style="width:100%;max-width:560px;border-radius:8px 8px 0 0;" />
            </div>
            
            <div style="padding:30px;background:white;border-radius:0 0 8px 8px;">
              <h2 style="color:#2e6c80;text-align:center;">Votre code OTP</h2>
              <p style="font-size:16px;">Bonjour,</p>
              <p style="font-size:16px;">
                Vous avez demandé un code de vérification pour accéder à votre compte Hostolink.
              </p>
              <p style="font-size:20px;font-weight:bold;text-align:center;margin:30px 0;color:#2e6c80;">
                ${otp}
              </p>
              <p style="font-size:16px;">
                Ce code est valable pendant <strong>5 minutes</strong>. Ne le partagez avec personne.
              </p>

              <hr style="margin:40px 0;" />

              <div style="text-align:center;">
                <img src="https://res.cloudinary.com/dhrrk7vsd/image/upload/v1740670387/hostolink/iqub8qpjfockmrboozmz.png" alt="Logo Explora Studio" style="height:40px;margin-bottom:10px;" />
                <p style="font-size:14px;color:#999;margin:0;">
                  Hostolink – propulsé par Explora Studio
                </p>
                <p style="font-size:12px;color:#bbb;">
                  © ${new Date().getFullYear()} Tous droits réservés.
                </p>
              </div>
            </div>
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
