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
const stream_1 = require("stream");
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: 'dhrrk7vsd',
    api_key: '197881586145143',
    api_secret: 'HEEz2vCv7MyxBRjCZScbXeUKgEw',
});
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 587,
            secure: false,
            auth: {
                user: 'startup@explora-studio.com',
                pass: 'Deb@dy4470#Deb@dy4470#',
            },
        });
    }
    async uploadImageFromBuffer(buffer) {
        try {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.v2.uploader.upload_stream({
                    folder: 'dreams-houses-img',
                    resource_type: 'auto',
                }, (error, result) => {
                    if (error) {
                        console.error('❌ Erreur Cloudinary :', error);
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                });
                stream_1.Readable.from(buffer).pipe(stream);
            });
            return result?.secure_url || '';
        }
        catch (err) {
            console.error('🔥 Échec complet de l’upload :', err);
            return '';
        }
    }
    async sendCustomEmail(data) {
        const { email, name, phone, message, propertyTitle, propertyLocation, propertyPrice, imageUrl, } = data;
        const html = `
      <div style="padding:20px;font-family:Arial,sans-serif">
        <h2 style="color:#1A237E">Nouvelle demande</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Téléphone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <h3>🏠 Propriété</h3>
        <p><strong>Titre:</strong> ${propertyTitle}</p>
        <p><strong>Lieu:</strong> ${propertyLocation}</p>
        <p><strong>Prix:</strong> ${propertyPrice}</p>
        ${imageUrl ? `<img src="${imageUrl}" style="max-width:100%;margin-top:10px;" />` : ''}
      </div>
    `;
        try {
            const mailOptions = {
                from: `Dreams-Houses" <startup@explora-studio.com>`,
                to: 'debadychatue@gmail.com',
                subject: '📬 Nouvelle demande de réservation',
                html,
            };
            await this.transporter.sendMail(mailOptions);
        }
        catch (err) {
            console.error(err);
            throw new common_1.InternalServerErrorException("Échec d'envoi de l'email.");
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=dream-houses-email.service.js.map