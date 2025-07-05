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
exports.OtpCleanerService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const otp_entity_1 = require("./entities/otp.entity");
const user_entity_1 = require("./entities/user.entity");
let OtpCleanerService = class OtpCleanerService {
    constructor(otpRepository, userRepository) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
    }
    async deleteExpiredOtps() {
        const now = new Date();
        const result = await this.otpRepository.delete({
            expires_at: (0, typeorm_2.LessThan)(now),
            is_valid: true,
        });
    }
    async deleteUnverifiedUsers() {
        const now = new Date();
        const threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const result = await this.userRepository
            .createQueryBuilder()
            .delete()
            .from(user_entity_1.User)
            .where('compte_verifier = false')
            .andWhere('date_inscription < :threshold', { threshold })
            .execute();
    }
};
exports.OtpCleanerService = OtpCleanerService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OtpCleanerService.prototype, "deleteExpiredOtps", null);
__decorate([
    (0, schedule_1.Cron)('0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OtpCleanerService.prototype, "deleteUnverifiedUsers", null);
exports.OtpCleanerService = OtpCleanerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(otp_entity_1.Otp)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OtpCleanerService);
//# sourceMappingURL=nettoyeur.service.js.map