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
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("./entities/transaction.entity");
let TransactionService = class TransactionService {
    constructor(transactionRepo) {
        this.transactionRepo = transactionRepo;
    }
    async createTransaction(dto) {
        const transaction = this.transactionRepo.create({
            ...dto,
            statut: 'en_attente',
        });
        return this.transactionRepo.save(transaction);
    }
    async updateTransactionStatus(id, dto) {
        const transaction = await this.transactionRepo.findOneBy({ id });
        if (!transaction)
            throw new common_1.NotFoundException('Transaction non trouvée');
        transaction.statut = dto.statut;
        return this.transactionRepo.save(transaction);
    }
    async getTransaction(id) {
        const transaction = await this.transactionRepo.findOneBy({ id });
        if (!transaction)
            throw new common_1.NotFoundException('Transaction non trouvée');
        return transaction;
    }
    async getAllTransactions() {
        return this.transactionRepo.find();
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map