"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
let EmailService = class EmailService {
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
    async sendOtpEmail(email, otp) {
        try {
            const mailOptions = {
                from: `"Explora Studio" <business@dreams-houses.com>`,
                to: email,
                subject: '🔐 Code de vérification - Hostolink',
                html: `
          <div style="max-width:600px;margin:auto;padding:20px;font-family:'Arial',sans-serif;background:#f9f9f9;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,0.1);">
            
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

              <div style="text-align:center;">
              <img src="https://res.cloudinary.com/dhrrk7vsd/image/upload/v1740668911/hostolink/axdjirzolotfs3sjrb2v.jpg" alt="Hostolink Banner" style="width:100%;max-width:560px;border-radius:8px 8px 0 0;" />
            </div>


              <hr style="margin:40px 0;" />

              <div style="text-align:center;">
                <img src="https://res.cloudinary.com/dhrrk7vsd/image/upload/v1740668911/hostolink/axdjirzolotfs3sjrb2v.jpg" alt="Logo Explora Studio" style="height:40px;margin-bottom:10px;" />
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
        }
        catch (error) {
            console.error('❌ Erreur lors de l’envoi de l’email :', error);
            throw new common_1.InternalServerErrorException('Erreur lors de l’envoi de l’email');
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map