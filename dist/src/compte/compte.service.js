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
exports.CompteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const compte_entity_1 = require("./entitie/compte.entity");
let CompteService = class CompteService {
    constructor(compteRepository) {
        this.compteRepository = compteRepository;
    }
    async createUserCompte(id_user) {
        const existingCompte = await this.compteRepository.findOne({ where: { id_user } });
        if (existingCompte) {
            return existingCompte;
        }
        const numeroCompte = `USER-${this.generateAccountNumber()}`;
        const newCompte = this.compteRepository.create({
            id_user,
            type_user: compte_entity_1.TypeUserEnum.UTILISATEUR,
            numero_compte: numeroCompte,
            solde_compte: 0,
            solde_bonus: 0,
            cumule_mensuel: 0,
            plafond: 0,
            devise: 'XOF',
            statut: 'actif',
            date_creation_compte: new Date(),
            date_modification: new Date(),
        });
        return this.compteRepository.save(newCompte);
    }
    async getUserCompte(id_user) {
        return this.compteRepository.findOne({ where: { id_user } });
    }
    generateAccountNumber() {
        const uuid = (0, uuid_1.v4)().replace(/-/g, '').substring(0, 12);
        return `${uuid.substring(0, 4)}-${uuid.substring(4, 8)}-${uuid.substring(8, 12)}`;
    }
    async updateCompteBonus(id_compte, nouveauSoldeBonus) {
        await this.compteRepository.update(id_compte, {
            solde_bonus: nouveauSoldeBonus,
            date_modification: new Date()
        });
    }
    async créditerBonusParrain(id_parrain, montant = 500) {
        const compte = await this.compteRepository.findOne({ where: { id_user: id_parrain } });
        if (!compte) {
            throw new common_1.NotFoundException(`Parrain avec id_user=${id_parrain} introuvable.`);
        }
        compte.solde_bonus += montant;
        compte.solde_compte += montant;
        compte.date_modification = new Date();
        await this.compteRepository.save(compte);
    }
};
exports.CompteService = CompteService;
exports.CompteService = CompteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(compte_entity_1.Compte)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CompteService);
//# sourceMappingURL=compte.service.js.map