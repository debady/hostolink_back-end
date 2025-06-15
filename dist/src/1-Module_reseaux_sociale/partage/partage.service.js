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
var PartageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const partage_entity_1 = require("./entities/partage.entity");
const uuid_1 = require("uuid");
let PartageService = PartageService_1 = class PartageService {
    constructor(partageRepository) {
        this.partageRepository = partageRepository;
        this.logger = new common_1.Logger(PartageService_1.name);
    }
    async create(createPartageDto) {
        this.logger.log('🔗 Création partage');
        this.validateSingleAuthor(createPartageDto);
        const uniqueId = (0, uuid_1.v4)();
        const lienPartage = `${process.env.APP_URL || 'http://localhost:3000'}/shared/${uniqueId}`;
        const partageData = {
            publication: { id_publication: createPartageDto.id_publication },
            lien_partage: lienPartage,
            plateforme_partage: createPartageDto.plateforme_partage,
            nombre_clics: 0,
        };
        if (createPartageDto.id_user) {
            partageData.id_user = createPartageDto.id_user;
        }
        if (createPartageDto.id_user_etablissement_sante) {
            partageData.id_user_etablissement_sante = createPartageDto.id_user_etablissement_sante;
        }
        if (createPartageDto.id_admin_gestionnaire) {
            partageData.id_admin_gestionnaire = createPartageDto.id_admin_gestionnaire;
        }
        if (createPartageDto.id_expert) {
            partageData.id_expert = createPartageDto.id_expert;
        }
        const partage = this.partageRepository.create(partageData);
        const savedPartage = await this.partageRepository.save(partage);
        this.logger.log(`✅ Partage créé avec ID: ${savedPartage.id_partage}`);
        return savedPartage;
    }
    validateSingleAuthor(dto) {
        const authorFields = [
            dto.id_user,
            dto.id_user_etablissement_sante,
            dto.id_admin_gestionnaire,
            dto.id_expert
        ].filter(field => field !== undefined && field !== null);
        if (authorFields.length === 0) {
            throw new common_1.BadRequestException('Au moins un ID d\'auteur doit être fourni (id_user, id_user_etablissement_sante, id_admin_gestionnaire, ou id_expert)');
        }
        if (authorFields.length > 1) {
            throw new common_1.BadRequestException('Un seul ID d\'auteur doit être fourni');
        }
    }
    async findByPublication(id_publication) {
        return this.partageRepository.find({
            where: { publication: { id_publication } },
            order: { date_partage: 'DESC' }
        });
    }
    async findByUser(id_user) {
        return this.partageRepository.find({
            where: { id_user },
            relations: ['publication'],
            order: { date_partage: 'DESC' }
        });
    }
    async findByEtablissement(id_etablissement) {
        return this.partageRepository.find({
            where: { id_user_etablissement_sante: id_etablissement },
            relations: ['publication'],
            order: { date_partage: 'DESC' }
        });
    }
    async findByAdmin(id_admin) {
        return this.partageRepository.find({
            where: { id_admin_gestionnaire: id_admin },
            relations: ['publication'],
            order: { date_partage: 'DESC' }
        });
    }
    async findByExpert(id_expert) {
        return this.partageRepository.find({
            where: { id_expert },
            relations: ['publication'],
            order: { date_partage: 'DESC' }
        });
    }
    async findByUniqueId(uniqueId) {
        const lienPartage = `${process.env.APP_URL || 'http://localhost:3000'}/shared/${uniqueId}`;
        const partage = await this.partageRepository.findOne({
            where: { lien_partage: lienPartage },
            relations: ['publication'],
        });
        if (!partage) {
            throw new common_1.BadRequestException('Partage introuvable');
        }
        return partage;
    }
    async incrementClics(id_partage) {
        const partage = await this.partageRepository.findOne({
            where: { id_partage },
        });
        if (!partage) {
            throw new common_1.BadRequestException('Partage introuvable');
        }
        partage.nombre_clics += 1;
        return this.partageRepository.save(partage);
    }
    async countByPublication(id_publication) {
        return this.partageRepository.count({
            where: { publication: { id_publication } }
        });
    }
    async getPublicationShareStats(id_publication) {
        const totalShares = await this.countByPublication(id_publication);
        const stats = await this.partageRepository
            .createQueryBuilder('partage')
            .where('partage.id_publication = :id_publication', { id_publication })
            .getMany();
        const userShares = stats.filter(s => s.id_user).length;
        const etablissementShares = stats.filter(s => s.id_user_etablissement_sante).length;
        const adminShares = stats.filter(s => s.id_admin_gestionnaire).length;
        const expertShares = stats.filter(s => s.id_expert).length;
        const totalClics = stats.reduce((sum, partage) => sum + partage.nombre_clics, 0);
        return {
            total_shares: totalShares,
            total_clics: totalClics,
            by_author_type: {
                user: userShares,
                etablissement: etablissementShares,
                admin: adminShares,
                expert: expertShares
            }
        };
    }
};
exports.PartageService = PartageService;
exports.PartageService = PartageService = PartageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(partage_entity_1.Partage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PartageService);
//# sourceMappingURL=partage.service.js.map