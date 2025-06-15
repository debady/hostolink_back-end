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
exports.TransactionInterneController = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const transaction_interne_service_1 = require("./transaction-interne.service");
const payer_avec_qr_dto_1 = require("./payer-avec/payer-avec-qr.dto");
const payer_avec_telephone_dto_1 = require("./payer-avec/payer-avec-telephone.dto");
const rollback_transaction_dto_1 = require("./rollback-dto/rollback-transaction.dto");
const payer_avec_email_dto_1 = require("./payer-avec/payer-avec-email.dto");
const transaction_interne_dto_1 = require("./dto/transaction-interne.dto");
const update_transaction_status_dto_1 = require("./dto/update-transaction-status.dto");
let TransactionInterneController = class TransactionInterneController {
    constructor(TransactionInterneService, moduleRef) {
        this.TransactionInterneService = TransactionInterneService;
        this.moduleRef = moduleRef;
    }
    async getMyTransactions(req) {
        return this.TransactionInterneService.getMyTransactions(req.user.id_user);
    }
    async getTransactionStats() {
        return {
            success: true,
            message: 'Statistiques des transactions récupérées',
            data: await this.TransactionInterneService.getStats()
        };
    }
    async getTransactionById(id, req) {
        const transaction = await this.TransactionInterneService.getTransactionById(+id);
        if (transaction.id_utilisateur_envoyeur !== req.user.id_user &&
            transaction.id_utilisateur_recepteur !== req.user.id_user) {
            throw new common_1.BadRequestException('Vous n\'avez pas accès à cette transaction');
        }
        return transaction;
    }
    async payWithQr(req, payWithQrDto) {
        return this.TransactionInterneService.createTransactionFromQrCode(req.user.id_user, payWithQrDto);
    }
    async payWithPhone(req, payWithPhoneDto) {
        return this.TransactionInterneService.createTransactionFromPhone(req.user.id_user, payWithPhoneDto);
    }
    async payWithEmail(req, payWithEmailDto) {
        try {
            const userId = req.user.id_user;
            if (!payWithEmailDto.email || !payWithEmailDto.montant_envoyer) {
                throw new common_1.BadRequestException('L\'email du destinataire et le montant sont requis');
            }
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
            if (!gmailRegex.test(payWithEmailDto.email)) {
                throw new common_1.BadRequestException('Veuillez fournir une adresse Gmail valide');
            }
            const isGmailEmail = payWithEmailDto.email.toLowerCase().endsWith('@gmail.com');
            if (!isGmailEmail) {
                throw new common_1.BadRequestException('Seules les adresses email Gmail sont acceptées pour le moment');
            }
            if (payWithEmailDto.montant_envoyer <= 499) {
                throw new common_1.BadRequestException('Le montant doit être supérieur à 500 F CFA');
            }
            return this.TransactionInterneService.createTransactionFromEmail(userId, payWithEmailDto);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Erreur lors du paiement via email: ${error.message}`);
        }
    }
    async cancelTransaction(id, req) {
        return this.TransactionInterneService.cancelTransaction(+id, req.user.id_user);
    }
    async rollbackTransaction(id, req, rollbackDto) {
        return this.TransactionInterneService.rollbackTransaction(+id, req.user.id_user, rollbackDto);
    }
    async getUserInfoFromQrCode(token) {
        return this.TransactionInterneService.getUserInfoFromQrCode(token);
    }
    async create(createTransactionDto) {
        return this.TransactionInterneService.createTransaction(createTransactionDto);
    }
    async updateStatus(id, updateStatusDto) {
        return this.TransactionInterneService.updateTransactionStatus(id, updateStatusDto.statut);
    }
};
exports.TransactionInterneController = TransactionInterneController;
__decorate([
    (0, common_1.Get)('mes_transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionInterneController.prototype, "getMyTransactions", null);
__decorate([
    (0, common_1.Get)('statistiques-des-transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionInterneController.prototype, "getTransactionStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionInterneController.prototype, "getTransactionById", null);
__decorate([
    (0, common_1.Post)('paiement_qrcode'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payer_avec_qr_dto_1.PayWithQrDto]),
    __metadata("design:returntype", Promise)
], TransactionInterneController.prototype, "payWithQr", null);
__decorate([
    (0, common_1.Post)('paiement_telephone'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payer_avec_telephone_dto_1.PayWithPhoneDto]),
    __metadata("design:returntype", Promise)
], TransactionInterneController.prototype, "payWithPhone", null);
__decorate([
    (0, common_1.Post)('/paiement_email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payer_avec_email_dto_1.PayWithEmailDto]),
    __metadata("design:returntype", Promise)
], TransactionInterneController.prototype, "payWithEmail", null);
__decorate([
    (0, common_1.Post)(':id/bloque_transaction'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionInterneController.prototype, "cancelTransaction", null);
__decorate([
    (0, common_1.Post)(':id/annule_transaction'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, rollback_transaction_dto_1.RollbackTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionInterneController.prototype, "rollbackTransaction", null);
__decorate([
    (0, common_1.Post)('info_qrcode'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionInterneController.prototype, "getUserInfoFromQrCode", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_interne_dto_1.CreateTransactionDto]),
    __metadata("design:returntype", Promise)
], TransactionInterneController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/statut'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_transaction_status_dto_1.UpdateTransactionStatusDto]),
    __metadata("design:returntype", Promise)
], TransactionInterneController.prototype, "updateStatus", null);
exports.TransactionInterneController = TransactionInterneController = __decorate([
    (0, common_1.Controller)('transaction'),
    __metadata("design:paramtypes", [transaction_interne_service_1.TransactionInterneService,
        core_1.ModuleRef])
], TransactionInterneController);
//# sourceMappingURL=transaction-interne.controller.js.map