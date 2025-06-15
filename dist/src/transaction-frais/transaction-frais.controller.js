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
exports.TransactionFraisController = void 0;
const common_1 = require("@nestjs/common");
const transaction_frais_service_1 = require("./transaction-frais.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TransactionFraisController = class TransactionFraisController {
    constructor(transactionFraisService) {
        this.transactionFraisService = transactionFraisService;
    }
    async getAllTransactionFrais(page = 1, limit = 100) {
        return {
            success: true,
            message: 'Transactions de frais récupérées',
            data: await this.transactionFraisService.findAll(page, limit)
        };
    }
    async getUserTransactionFrais(id_user, page = 1, limit = 100) {
        return {
            success: true,
            message: `Transactions de frais de l'utilisateur ${id_user} récupérées`,
            data: await this.transactionFraisService.findByUser(id_user, page, limit)
        };
    }
    async getTransactionFraisStats() {
        return {
            success: true,
            message: 'Statistiques des frais de transaction récupérées',
            data: await this.transactionFraisService.getStats()
        };
    }
    async getUserTransactionFraisStats(id_user) {
        return {
            success: true,
            message: `Statistiques des frais de transaction de l'utilisateur ${id_user} récupérées`,
            data: await this.transactionFraisService.getUserStats(id_user)
        };
    }
    async getTransactionFraisById(id) {
        return {
            success: true,
            message: 'Transaction de frais récupérée',
            data: await this.transactionFraisService.findOne(id)
        };
    }
};
exports.TransactionFraisController = TransactionFraisController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionFraisController.prototype, "getAllTransactionFrais", null);
__decorate([
    (0, common_1.Get)('utilisateur/:id_user'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id_user')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], TransactionFraisController.prototype, "getUserTransactionFrais", null);
__decorate([
    (0, common_1.Get)('statistiques-des-frais'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TransactionFraisController.prototype, "getTransactionFraisStats", null);
__decorate([
    (0, common_1.Get)('stats/utilisateur/:id_user'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id_user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionFraisController.prototype, "getUserTransactionFraisStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TransactionFraisController.prototype, "getTransactionFraisById", null);
exports.TransactionFraisController = TransactionFraisController = __decorate([
    (0, common_1.Controller)('transaction-frais'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __metadata("design:paramtypes", [transaction_frais_service_1.TransactionFraisService])
], TransactionFraisController);
//# sourceMappingURL=transaction-frais.controller.js.map