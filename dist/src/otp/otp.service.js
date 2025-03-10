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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const otp_entity_1 = require("../otp/entities/otp.entity");
let OtpService = class OtpService {
    constructor(otpRepository, userRepository) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
    }
    async generateOtp(identifier) {
        try {
            identifier = identifier.trim();
            const user = await this.userRepository.findOne({
                where: [{ email: identifier }, { telephone: identifier }],
            });
            if (!user) {
                throw new common_1.BadRequestException("Utilisateur non trouvé");
            }
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 5);
            await this.otpRepository.delete({ user: { id_user: user.id_user } });
            const otp = this.otpRepository.create({
                user: user,
                otp_code: otpCode,
                expires_at: expirationDate,
                is_valid: true,
            });
            await this.otpRepository.save(otp);
            console.log(`📩 OTP généré pour ${identifier} : ${otpCode}`);
            return { success: true, otp: otpCode };
        }
        catch (error) {
            console.error("❌ Erreur lors de la génération de l'OTP :", error);
            throw new common_1.InternalServerErrorException("Erreur lors de la génération de l'OTP");
        }
    }
    async verifyOtp(identifier, otpCode) {
        try {
            identifier = identifier.trim();
            otpCode = otpCode.trim();
            const user = await this.userRepository.findOne({
                where: [{ email: identifier }, { telephone: identifier }],
            });
            if (!user) {
                throw new common_1.BadRequestException("Utilisateur non trouvé");
            }
            const otp = await this.otpRepository.findOne({
                where: { user: { id_user: user.id_user }, otp_code: otpCode, is_valid: true },
            });
            if (!otp) {
                return { success: false, message: "Code OTP incorrect ou expiré" };
            }
            if (new Date() > otp.expires_at) {
                otp.is_valid = false;
                await this.otpRepository.save(otp);
                return { success: false, message: "Code OTP expiré" };
            }
            otp.is_valid = false;
            await this.otpRepository.save(otp);
            return { success: true, message: "Code OTP valide" };
        }
        catch (error) {
            console.error("❌ Erreur lors de la vérification de l'OTP :", error);
            throw new common_1.InternalServerErrorException("Erreur lors de la vérification de l'OTP");
        }
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(otp_entity_1.Otp)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OtpService);
//# sourceMappingURL=otp.service.js.map