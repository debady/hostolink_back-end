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
var CleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleanupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const qr_code_dynamique_entity_1 = require("./entitie/qr_code_dynamique.entity");
const qr_code_service_1 = require("./qr-code.service");
let CleanupService = CleanupService_1 = class CleanupService {
    constructor(qrCodeService, qrCodeDynamiqueRepository) {
        this.qrCodeService = qrCodeService;
        this.qrCodeDynamiqueRepository = qrCodeDynamiqueRepository;
        this.logger = new common_1.Logger(CleanupService_1.name);
        this.qrCodeUpdateTimers = new Map();
    }
    async onModuleInit() {
        await this.scheduleAllActiveQrCodeUpdates();
    }
    async scheduleAllActiveQrCodeUpdates() {
        try {
            const activeQrCodes = await this.qrCodeDynamiqueRepository.find({
                where: { statut: 'actif' }
            });
            for (const qrCode of activeQrCodes) {
                this.scheduleQrCodeUpdate(qrCode);
            }
        }
        catch (error) {
        }
    }
    scheduleQrCodeUpdate(qrCode) {
        if (this.qrCodeUpdateTimers.has(qrCode.id_qrcode)) {
            clearTimeout(this.qrCodeUpdateTimers.get(qrCode.id_qrcode));
            this.qrCodeUpdateTimers.delete(qrCode.id_qrcode);
        }
        const now = new Date().getTime();
        const expirationTime = qrCode.date_expiration.getTime();
        let delay = expirationTime - now;
        if (delay <= 0) {
            this.updateQrCodeToken(qrCode.id_qrcode);
            return;
        }
        const timerId = setTimeout(() => {
            this.updateQrCodeToken(qrCode.id_qrcode);
        }, delay);
        this.qrCodeUpdateTimers.set(qrCode.id_qrcode, timerId);
    }
    async updateQrCodeToken(qrCodeId) {
        try {
            const qrCode = await this.qrCodeDynamiqueRepository.findOne({
                where: { id_qrcode: qrCodeId }
            });
            if (!qrCode || qrCode.statut !== 'actif') {
                this.qrCodeUpdateTimers.delete(qrCodeId);
                return;
            }
            const compte = await this.qrCodeService['compteService'].getUserCompte(qrCode.id_user);
            const payload = this.qrCodeService.createUserPayload(qrCode.id_user, true, 60, {
                accountNumber: compte?.numero_compte,
                currency: compte?.devise
            });
            const token = this.qrCodeService.generateTokenWithPayload(payload);
            qrCode.token = token;
            qrCode.date_expiration = new Date(payload.expiresAt || Date.now() + (60 * 1000));
            await this.qrCodeDynamiqueRepository.save(qrCode);
            this.scheduleQrCodeUpdate(qrCode);
        }
        catch (error) {
            this.qrCodeUpdateTimers.delete(qrCodeId);
        }
    }
    async scheduledCleanup() {
        const deletedCount = await this.qrCodeService.deleteOldExpiredQrCodes(7);
        this.logger.log(`${deletedCount} QR codes dynamiques très anciens supprimés`);
    }
    async deactivateExpiredQrCodes() {
        const now = new Date();
        const expiredCodes = await this.qrCodeDynamiqueRepository.find({
            where: {
                statut: 'actif',
                date_expiration: (0, typeorm_2.LessThan)(now),
            },
            select: ['id_user'],
        });
        const userIds = [...new Set(expiredCodes.map(code => code.id_user))];
        const result = await this.qrCodeDynamiqueRepository.update({
            statut: 'actif',
            date_expiration: (0, typeorm_2.LessThan)(now),
        }, {
            statut: 'inactif',
        });
    }
    async removeOldQrCodes() {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 1);
        const result = await this.qrCodeDynamiqueRepository.delete({
            date_expiration: (0, typeorm_2.LessThan)(cutoffDate)
        });
    }
    async manualCleanup() {
        const deletedCount = await this.qrCodeService.deleteOldExpiredQrCodes(7);
        return {
            deleted: deletedCount
        };
    }
};
exports.CleanupService = CleanupService;
__decorate([
    (0, schedule_1.Cron)('0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CleanupService.prototype, "scheduledCleanup", null);
exports.CleanupService = CleanupService = CleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => qr_code_service_1.QrCodeService))),
    __param(1, (0, typeorm_1.InjectRepository)(qr_code_dynamique_entity_1.QrCodeDynamique)),
    __metadata("design:paramtypes", [qr_code_service_1.QrCodeService,
        typeorm_2.Repository])
], CleanupService);
//# sourceMappingURL=cleanup.service.js.map