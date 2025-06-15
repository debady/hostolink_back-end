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
exports.TransactionFraisService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_frais_entity_1 = require("./entite/transaction-frais.entity");
let TransactionFraisService = class TransactionFraisService {
    constructor(transactionFraisRepository) {
        this.transactionFraisRepository = transactionFraisRepository;
    }
    async findAll(page, limit) {
        const skip = (page - 1) * limit;
        const [transactions, total] = await this.transactionFraisRepository.findAndCount({
            skip,
            take: limit,
            order: { date_creation: 'DESC' }
        });
        return {
            transactions,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    }
    async findOne(id) {
        const transaction = await this.transactionFraisRepository.findOne({
            where: { id_frais: id }
        });
        if (!transaction) {
            throw new common_1.NotFoundException(`Transaction de frais avec ID ${id} non trouvée`);
        }
        return transaction;
    }
    async findByUser(id_user, page, limit) {
        const skip = (page - 1) * limit;
        const [transactions, total] = await this.transactionFraisRepository.createQueryBuilder('frais')
            .innerJoin('frais.transaction', 'transaction')
            .innerJoin('transaction.compte', 'compte')
            .where('compte.id_user = :id_user', { id_user })
            .skip(skip)
            .take(limit)
            .orderBy('frais.date_creation', 'DESC')
            .getManyAndCount();
        return {
            transactions,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    }
    async getStats() {
        const statsByType = await this.transactionFraisRepository.createQueryBuilder('frais')
            .select('frais.type_transaction', 'type')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(frais.montant_frais)', 'total')
            .groupBy('frais.type_transaction')
            .getRawMany();
        const statsByMode = await this.transactionFraisRepository.createQueryBuilder('frais')
            .select('frais.mode_paiement', 'mode')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(frais.montant_frais)', 'total')
            .groupBy('frais.mode_paiement')
            .getRawMany();
        const totalStats = await this.transactionFraisRepository.createQueryBuilder('frais')
            .select('COUNT(*)', 'count')
            .addSelect('SUM(frais.montant_frais)', 'total')
            .getRawOne();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const statistique_journalière = await this.transactionFraisRepository.createQueryBuilder('frais')
            .select('COUNT(*)', 'count')
            .addSelect('SUM(frais.montant_frais)', 'total')
            .where('frais.date_creation >= :startDate', { startDate: today })
            .andWhere('frais.date_creation < :endDate', { endDate: tomorrow })
            .getRawOne();
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 6);
        weekStart.setHours(0, 0, 0, 0);
        const statistique_hebdomadaire = await this.transactionFraisRepository.createQueryBuilder('frais')
            .select('COUNT(*)', 'count')
            .addSelect('SUM(frais.montant_frais)', 'total')
            .where('frais.date_creation >= :startDate', { startDate: weekStart })
            .andWhere('frais.date_creation < :endDate', { endDate: tomorrow })
            .getRawOne();
        const monthStart = new Date();
        monthStart.setDate(monthStart.getDate() - 29);
        monthStart.setHours(0, 0, 0, 0);
        const statistique_mensuelle = await this.transactionFraisRepository.createQueryBuilder('frais')
            .select('COUNT(*)', 'count')
            .addSelect('SUM(frais.montant_frais)', 'total')
            .where('frais.date_creation >= :startDate', { startDate: monthStart })
            .andWhere('frais.date_creation < :endDate', { endDate: tomorrow })
            .getRawOne();
        const yearStart = new Date();
        yearStart.setDate(yearStart.getDate() - 364);
        yearStart.setHours(0, 0, 0, 0);
        const statistique_annuelle = await this.transactionFraisRepository.createQueryBuilder('frais')
            .select('COUNT(*)', 'count')
            .addSelect('SUM(frais.montant_frais)', 'total')
            .where('frais.date_creation >= :startDate', { startDate: yearStart })
            .andWhere('frais.date_creation < :endDate', { endDate: tomorrow })
            .getRawOne();
        const dailyDetail = await this.transactionFraisRepository.createQueryBuilder('frais')
            .select("to_char(frais.date_creation, 'DD-MM-YYYY')", 'date')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(frais.montant_frais)', 'total')
            .where('frais.date_creation >= :startDate', { startDate: weekStart })
            .groupBy("to_char(frais.date_creation, 'DD-MM-YYYY')")
            .orderBy('date', 'ASC')
            .getRawMany();
        const monthlyDetail = await this.transactionFraisRepository.createQueryBuilder('frais')
            .select("to_char(frais.date_creation, 'MM-YYYY')", 'month')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(frais.montant_frais)', 'total')
            .where('frais.date_creation >= :startDate', { startDate: yearStart })
            .groupBy("to_char(frais.date_creation, 'MM-YYYY')")
            .orderBy('month', 'ASC')
            .getRawMany();
        return {
            somme_totale_des_frais: totalStats,
            stat_par_type_transaction: statsByType,
            stat_par_mode_de_paiement: statsByMode,
            stats_par_periode: {
                statistique_journalière: statistique_journalière,
                statistique_hebdomadaire: statistique_hebdomadaire,
                statistique_mensuelle: statistique_mensuelle,
                statistique_annuelle: statistique_annuelle,
            },
            details: {
                journalière: dailyDetail,
                mensuelle: monthlyDetail
            }
        };
    }
    async getUserStats(id_user) {
        const statsByType = await this.transactionFraisRepository.createQueryBuilder('frais')
            .innerJoin('frais.transaction', 'transaction')
            .innerJoin('transaction.compte', 'compte')
            .select('frais.type_transaction', 'type')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(frais.montant_frais)', 'total')
            .where('compte.id_user = :id_user', { id_user })
            .groupBy('frais.type_transaction')
            .getRawMany();
        const statsByMode = await this.transactionFraisRepository.createQueryBuilder('frais')
            .innerJoin('frais.transaction', 'transaction')
            .innerJoin('transaction.compte', 'compte')
            .select('frais.mode_paiement', 'mode')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(frais.montant_frais)', 'total')
            .where('compte.id_user = :id_user', { id_user })
            .groupBy('frais.mode_paiement')
            .getRawMany();
        const totalStats = await this.transactionFraisRepository.createQueryBuilder('frais')
            .innerJoin('frais.transaction', 'transaction')
            .innerJoin('transaction.compte', 'compte')
            .select('COUNT(*)', 'count')
            .addSelect('SUM(frais.montant_frais)', 'total')
            .where('compte.id_user = :id_user', { id_user })
            .getRawOne();
        return {
            total: totalStats,
            byType: statsByType,
            byMode: statsByMode
        };
    }
};
exports.TransactionFraisService = TransactionFraisService;
exports.TransactionFraisService = TransactionFraisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_frais_entity_1.TransactionFrais)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TransactionFraisService);
//# sourceMappingURL=transaction-frais.service.js.map