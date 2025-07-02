import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class WaveEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false,
      auth: {
        user: 'business@dreams-houses.com',
        pass: 'Deb@dy4470##Deb@dy4470##Deb@dy4470##Deb@dy4470##',
      },
    });
  }

  async sendWaveVerificationOtp(email: string, otp: string, etablissementNom: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"Hostolink - Retrait Wave" <business@dreams-houses.com>`,
        to: email,
        subject: '🌊 Vérification compte Wave - Hostolink',
        html: `
          <div style="max-width:600px;margin:auto;padding:20px;font-family:'Arial',sans-serif;background:#f9f9f9;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align:center;">
              <img src="https://res.cloudinary.com/dhrrk7vsd/image/upload/v1740668911/hostolink/axdjirzolotfs3sjrb2v.jpg" alt="Hostolink Banner" style="width:100%;max-width:560px;border-radius:8px 8px 0 0;" />
            </div>
            
            <div style="padding:30px;background:white;border-radius:0 0 8px 8px;">
              <h2 style="color:#1e40af;text-align:center;">🌊 Vérification compte Wave</h2>
              
              <p style="font-size:16px;">Bonjour <strong>${etablissementNom}</strong>,</p>
              
              <p style="font-size:16px;">
                Vous avez configuré un numéro Wave pour les retraits. Pour des raisons de sécurité, 
                nous devons vérifier que ce numéro vous appartient bien.
              </p>
              
              <div style="background:#e0f2fe;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
                <p style="font-size:18px;margin-bottom:10px;">Votre code de vérification :</p>
                <p style="font-size:32px;font-weight:bold;color:#1e40af;margin:0;letter-spacing:3px;">
                  ${otp}
                </p>
              </div>
              
              <p style="font-size:16px;">
                ⏰ Ce code est valable pendant <strong>10 minutes</strong>.<br>
                🔐 Ne le partagez avec personne pour votre sécurité.
              </p>
              
              <div style="background:#fef3c7;padding:15px;border-radius:8px;margin:20px 0;">
                <p style="font-size:14px;margin:0;color:#92400e;">
                  <strong>Étapes suivantes :</strong><br>
                  1. Saisissez ce code dans votre application<br>
                  2. Une fois vérifié, vous pourrez effectuer vos retraits Wave<br>
                  3. Vos fonds seront transférés directement sur votre compte Wave
                </p>
              </div>
              
              <hr style="margin:40px 0;" />
              
              <div style="text-align:center;">
                <p style="font-size:14px;color:#999;margin:0;">
                  Hostolink – Plateforme de santé digitale
                </p>
                <p style="font-size:12px;color:#bbb;">
                  © ${new Date().getFullYear()} Propulsé par Explora Studio. Tous droits réservés.
                </p>
              </div>
            </div>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email OTP Wave envoyé à ${email} | ID: ${info.messageId}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email OTP Wave :', error);
      throw new InternalServerErrorException('Erreur lors de l\'envoi de l\'email de vérification');
    }
  }

  async sendWaveActivationConfirmation(email: string, etablissementNom: string, numeroWave: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"Hostolink - Retrait Wave" <business@dreams-houses.com>`,
        to: email,
        subject: '✅ Compte Wave activé - Hostolink',
        html: `
          <div style="max-width:600px;margin:auto;padding:20px;font-family:'Arial',sans-serif;background:#f9f9f9;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1);">
            <div style="text-align:center;">
              <img src="https://res.cloudinary.com/dhrrk7vsd/image/upload/v1740668911/hostolink/axdjirzolotfs3sjrb2v.jpg" alt="Hostolink Banner" style="width:100%;max-width:560px;border-radius:8px 8px 0 0;" />
            </div>
            
            <div style="padding:30px;background:white;border-radius:0 0 8px 8px;">
              <h2 style="color:#16a34a;text-align:center;">✅ Compte Wave activé avec succès !</h2>
              
              <p style="font-size:16px;">Félicitations <strong>${etablissementNom}</strong> !</p>
              
              <p style="font-size:16px;">
                Votre numéro Wave <strong>${numeroWave}</strong> a été vérifié et activé avec succès.
              </p>
              
              <div style="background:#dcfce7;padding:20px;border-radius:8px;margin:20px 0;">
                <h3 style="color:#16a34a;margin-top:0;">🎉 Vous pouvez maintenant :</h3>
                <ul style="margin:0;">
                  <li>Effectuer des retraits de vos revenus</li>
                  <li>Recevoir les fonds directement sur votre compte Wave</li>
                  <li>Consulter l'historique de vos transactions</li>
                  <li>Gérer vos limites de retrait</li>
                </ul>
              </div>
              
              <div style="background:#e0f2fe;padding:15px;border-radius:8px;margin:20px 0;">
                <p style="font-size:14px;margin:0;color:#0f766e;">
                  <strong>💡 Rappel sécurité :</strong><br>
                  • Gardez vos identifiants Wave confidentiels<br>
                  • Vérifiez toujours les montants avant validation<br>
                  • Contactez notre support en cas de problème
                </p>
              </div>
              
              <hr style="margin:40px 0;" />
              
              <div style="text-align:center;">
                <p style="font-size:14px;color:#999;margin:0;">
                  Hostolink – Plateforme de santé digitale
                </p>
                <p style="font-size:12px;color:#bbb;">
                  © ${new Date().getFullYear()} Propulsé par Explora Studio. Tous droits réservés.
                </p>
              </div>
            </div>
          </div>
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email confirmation Wave envoyé à ${email} | ID: ${info.messageId}`);
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de confirmation :', error);
      // On ne throw pas l'erreur car ce n'est pas critique
    }
  }
}