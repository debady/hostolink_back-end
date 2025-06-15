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
exports.QrCodeController = void 0;
const common_1 = require("@nestjs/common");
const qr_code_service_1 = require("./qr-code.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let QrCodeController = class QrCodeController {
    constructor(qrCodeService) {
        this.qrCodeService = qrCodeService;
    }
    async generateDynamicQrCode(req, body) {
        const id_user = req.user.id_user;
        const expiresIn = body.expiresIn || 60;
        const compte = await this.qrCodeService['compteService'].getUserCompte(id_user);
        const accountNumber = compte ? compte.numero_compte : undefined;
        const currency = compte ? compte.devise : undefined;
        const qrCode = await this.qrCodeService.refreshUserDynamicQrCode(id_user, accountNumber, expiresIn, currency);
        if (!qrCode) {
            return {
                success: false,
                message: 'Erreur lors de la génération du QR code dynamique',
            };
        }
        const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
        const now = new Date();
        const remainingTime = Math.floor((qrCode.date_expiration.getTime() - now.getTime()) / 1000);
        return {
            success: true,
            message: 'QR code dynamique généré avec succès',
            data: {
                id_qrcode: qrCode.id_qrcode,
                short_id: qrCode.short_id,
                token: qrCode.token,
                date_expiration: qrCode.date_expiration,
                remaining_seconds: remainingTime > 0 ? remainingTime : 0,
                qr_code_image: qrCodeImageUrl,
            }
        };
    }
    async getStaticQrCode(req) {
        const id_user = req.user.id_user;
        const compte = await this.qrCodeService['compteService'].getUserCompte(id_user);
        const accountNumber = compte ? compte.numero_compte : undefined;
        let qrCode = await this.qrCodeService.getUserStaticQrCode(id_user);
        if (!qrCode) {
            qrCode = await this.qrCodeService.createStaticQrForNewUser(id_user, accountNumber);
        }
        const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
        return {
            success: true,
            message: 'QR code statique récupéré',
            data: {
                id_qrcode: qrCode.id_qrcode,
                short_id: qrCode.short_id,
                token: qrCode.token,
                qr_code_image: qrCodeImageUrl,
            }
        };
    }
    async getMyDynamicQrCode(req) {
        const id_user = req.user.id_user;
        const dynamicQrCodes = await this.qrCodeService.getUserDynamicQrCodes(id_user);
        const latestQrCode = dynamicQrCodes[0];
        const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(latestQrCode.short_id);
        const now = new Date();
        const remainingTime = Math.floor((latestQrCode.date_expiration.getTime() - now.getTime()) / 1000);
        return {
            success: true,
            message: 'QR code dynamique récupéré',
            data: {
                id_qrcode: latestQrCode.id_qrcode,
                short_id: latestQrCode.short_id,
                token: latestQrCode.token,
                date_expiration: latestQrCode.date_expiration,
                remaining_seconds: remainingTime > 0 ? remainingTime : 0,
                qr_code_image: qrCodeImageUrl,
            }
        };
    }
    async validateQrCode(body) {
        try {
            const validationResult = await this.qrCodeService.validateQrCode(body.token);
            return {
                success: true,
                message: 'QR code valide',
                data: validationResult
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || 'Erreur lors de la validation du QR code',
                data: null
            };
        }
    }
    async refreshAllStaticQrCodes() {
        return this.qrCodeService.refreshAllStaticQrCodes();
    }
    async refreshDynamicQrCode(req, body) {
        const id_user = req.user.id_user;
        const expiresIn = body.expiresIn || 60;
        const compte = await this.qrCodeService['compteService'].getUserCompte(id_user);
        const accountNumber = compte ? compte.numero_compte : undefined;
        const currency = compte ? compte.devise : undefined;
        const qrCode = await this.qrCodeService.refreshUserDynamicQrCode(id_user, accountNumber, expiresIn, currency);
        const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
        const now = new Date();
        const remainingTime = Math.floor((qrCode.date_expiration.getTime() - now.getTime()) / 1000);
        return {
            success: true,
            message: 'QR code dynamique rafraîchi avec succès',
            data: {
                id_qrcode: qrCode.id_qrcode,
                short_id: qrCode.short_id,
                token: qrCode.token,
                date_expiration: qrCode.date_expiration,
                remaining_seconds: remainingTime > 0 ? remainingTime : 0,
                qr_code_image: qrCodeImageUrl,
            }
        };
    }
    async getAllUserQrCodes(req) {
        const id_user = req.user.id_user;
        const allQrCodes = await this.qrCodeService.getAllUserQrCodes(id_user);
        const staticQrCodesWithImages = await Promise.all(allQrCodes.static.map(async (qrCode) => {
            const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
            return {
                ...qrCode,
                qr_code_image: qrCodeImageUrl
            };
        }));
        const dynamicQrCodesWithImages = await Promise.all(allQrCodes.dynamic.map(async (qrCode) => {
            const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
            const now = new Date();
            const remainingTime = Math.floor((qrCode.date_expiration.getTime() - now.getTime()) / 1000);
            return {
                ...qrCode,
                remaining_seconds: remainingTime > 0 ? remainingTime : 0,
                qr_code_image: qrCodeImageUrl
            };
        }));
        return {
            success: true,
            message: 'Tous les QR codes récupérés',
            data: {
                static: staticQrCodesWithImages,
                dynamic: dynamicQrCodesWithImages
            }
        };
    }
    async getUserQrCodes(id_user) {
        const allQrCodes = await this.qrCodeService.getAllUserQrCodes(id_user);
        const staticQrCodesWithImages = await Promise.all(allQrCodes.static.map(async (qrCode) => {
            const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
            return {
                ...qrCode,
                qr_code_image: qrCodeImageUrl
            };
        }));
        const dynamicQrCodesWithImages = await Promise.all(allQrCodes.dynamic.map(async (qrCode) => {
            const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
            const now = new Date();
            const remainingTime = Math.floor((qrCode.date_expiration.getTime() - now.getTime()) / 1000);
            return {
                ...qrCode,
                remaining_seconds: remainingTime > 0 ? remainingTime : 0,
                qr_code_image: qrCodeImageUrl
            };
        }));
        return {
            success: true,
            message: `QR codes de l'utilisateur ${id_user} récupérés`,
            data: {
                static: staticQrCodesWithImages,
                dynamic: dynamicQrCodesWithImages
            }
        };
    }
    async getQrCodeById(type, id_qrcode) {
        if (type !== 'static' && type !== 'dynamic') {
            return {
                success: false,
                message: 'Type de QR code invalide. Utilisez "static" ou "dynamic"'
            };
        }
        const qrCode = await this.qrCodeService.getQrCodeById(id_qrcode, type);
        if (!qrCode) {
            return {
                success: false,
                message: 'QR code non trouvé'
            };
        }
        const qrCodeImageUrl = await this.qrCodeService.generateQrCodeImage(qrCode.short_id);
        let remainingSeconds = undefined;
        if (type === 'dynamic' && 'date_expiration' in qrCode) {
            const now = new Date();
            const remainingTime = Math.floor((qrCode.date_expiration.getTime() - now.getTime()) / 1000);
            remainingSeconds = remainingTime > 0 ? remainingTime : 0;
        }
        return {
            success: true,
            message: 'QR code récupéré',
            data: {
                ...qrCode,
                remaining_seconds: remainingSeconds,
                qr_code_image: qrCodeImageUrl
            }
        };
    }
};
exports.QrCodeController = QrCodeController;
__decorate([
    (0, common_1.Post)('dynamic'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "generateDynamicQrCode", null);
__decorate([
    (0, common_1.Get)('static'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "getStaticQrCode", null);
__decorate([
    (0, common_1.Get)('my-dynamic'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "getMyDynamicQrCode", null);
__decorate([
    (0, common_1.Post)('valider_qr_code'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "validateQrCode", null);
__decorate([
    (0, common_1.Post)('rafrechir-qrcode-static'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "refreshAllStaticQrCodes", null);
__decorate([
    (0, common_1.Post)('rafrechir-qrcode-dynamic'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "refreshDynamicQrCode", null);
__decorate([
    (0, common_1.Get)('les-deux-qr-codes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "getAllUserQrCodes", null);
__decorate([
    (0, common_1.Get)('utilisateur/:id_user'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id_user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "getUserQrCodes", null);
__decorate([
    (0, common_1.Get)(':type/:id_qrcode'),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, common_1.Param)('id_qrcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], QrCodeController.prototype, "getQrCodeById", null);
exports.QrCodeController = QrCodeController = __decorate([
    (0, common_1.Controller)('qr-codes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [qr_code_service_1.QrCodeService])
], QrCodeController);
//# sourceMappingURL=qr-code.controller.js.map