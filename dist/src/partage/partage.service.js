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
exports.PartageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const partage_entity_1 = require("./entities/partage.entity");
const uuid_1 = require("uuid");
let PartageService = class PartageService {
    constructor(partageRepository) {
        this.partageRepository = partageRepository;
    }
    async create(createPartageDto) {
        const uniqueId = (0, uuid_1.v4)();
        const lienPartage = `${process.env.APP_URL}/shared/${uniqueId}`;
        const partage = this.partageRepository.create({
            user: { id_user: createPartageDto.id_user },
            publication: { id_publication: createPartageDto.id_publication },
            lien_partage: lienPartage,
            plateforme_partage: createPartageDto.plateforme_partage,
        });
        return this.partageRepository.save(partage);
    }
    async incrementClics(id_partage) {
        const partage = await this.partageRepository.findOne({
            where: { id_partage },
        });
        if (!partage) {
            throw new Error('Partage not found');
        }
        partage.nombre_clics += 1;
        return this.partageRepository.save(partage);
    }
    async findByUniqueId(uniqueId) {
        const lienPartage = `${process.env.APP_URL}/shared/${uniqueId}`;
        const partage = await this.partageRepository.findOne({
            where: { lien_partage: lienPartage },
            relations: ['publication', 'user'],
        });
        if (!partage) {
            throw new Error('Partage not found');
        }
        return partage;
    }
    async findByPublication(id_publication) {
        return this.partageRepository.find({
            where: { publication: { id_publication } },
            relations: ['user'],
        });
    }
    async findByUser(id_user) {
        return this.partageRepository.find({
            where: { user: { id_user } },
            relations: ['publication'],
        });
    }
    async countByPublication(id_publication) {
        const count = await this.partageRepository.count({
            where: { publication: { id_publication } }
        });
        return count;
    }
    async getPublicationShareStats(id_publication) {
        const totalShares = await this.partageRepository.count({
            where: { publication: { id_publication } }
        });
    }
    async deletePartagesByPublicationId(id_publication) {
        await this.partageRepository.delete({ publication: { id_publication } });
    }
};
exports.PartageService = PartageService;
exports.PartageService = PartageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(partage_entity_1.Partage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PartageService);
//# sourceMappingURL=partage.service.js.map