"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const twilio_1 = __importDefault(require("twilio"));
let SmsService = class SmsService {
    constructor() {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        if (!accountSid || !authToken) {
            throw new common_1.InternalServerErrorException('❌ Twilio SID ou Auth Token manquant dans .env');
        }
        this.client = (0, twilio_1.default)(accountSid, authToken);
    }
    async sendOtpSms(phoneNumber, otpCode) {
        const fromNumber = process.env.TWILIO_PHONE_NUMBER;
        console.log(`🔍 Tentative SMS vers: ${phoneNumber}`);
        console.log(`🔍 Depuis le numéro: ${fromNumber}`);
        try {
            const message = await this.client.messages.create({
                body: `Akwaba, Voici le code de vérification: ${otpCode}. Valable 5 min.`,
                from: fromNumber,
                to: phoneNumber,
            });
            setTimeout(async () => {
                const finalMessage = await this.client.messages(message.sid).fetch();
                console.log(`📊 Statut final: ${finalMessage.status}`);
                if (finalMessage.errorCode) {
                    console.error(`❌ Erreur Twilio: ${finalMessage.errorCode} - ${finalMessage.errorMessage}`);
                }
            }, 5000);
            console.log(`✅ SMS envoyé! SID: ${message.sid}, Status: ${message.status}`);
        }
        catch (error) {
            console.error('❌ Détail erreur Twilio:', error.message);
            console.error('❌ Code erreur:', error.code);
            throw new common_1.InternalServerErrorException(`Twilio Error: ${error.message}`);
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], SmsService);
//# sourceMappingURL=sms.service.js.map