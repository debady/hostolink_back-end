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
exports.EtablissementSanteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const etablissement_sante_entity_1 = require("./entities/etablissement_sante.entity");
const etablissement_sante_repository_1 = require("./repository/etablissement_sante.repository");
let EtablissementSanteService = class EtablissementSanteService {
    constructor(etablissementSanteRepository, etablissementSanteRepo) {
        this.etablissementSanteRepository = etablissementSanteRepository;
        this.etablissementSanteRepo = etablissementSanteRepo;
    }
    async createEtablissement(data) {
        const result = await this.etablissementSanteRepository
            .createQueryBuilder()
            .insert()
            .into(etablissement_sante_entity_1.EtablissementSante)
            .values({
            nom: data.nom,
            telephone: data.telephone,
            categorie: data.categorie,
            adresse: data.adresse,
            latitude: data.latitude,
            longitude: data.longitude,
            geom: () => `ST_SetSRID(ST_MakePoint(${data.longitude}, ${data.latitude}), 4326)`,
        })
            .returning('*')
            .execute();
        const insertedEtablissement = result.raw[0];
        await this.etablissementSanteRepository
            .createQueryBuilder()
            .update(etablissement_sante_entity_1.EtablissementSante)
            .set({
            geom: () => `ST_SetSRID(ST_MakePoint(${insertedEtablissement.longitude}, ${insertedEtablissement.latitude}), 4326)`,
        })
            .where('id_user_etablissement_sante = :id', { id: insertedEtablissement.id })
            .execute();
        return insertedEtablissement;
    }
    async findAll() {
        return this.etablissementSanteRepository.find();
    }
    async findOne(id) {
        const etablissement = await this.etablissementSanteRepository.findOne({ where: { id } });
        if (!etablissement) {
            throw new common_1.NotFoundException(`Établissement avec l'ID ${id} introuvable.`);
        }
        return etablissement;
    }
    async findNearby(lat, lng, distanceKm) {
        const distanceMeters = distanceKm * 1000;
        return this.etablissementSanteRepository
            .createQueryBuilder('etablissement')
            .where(`
      ST_DWithin(
        etablissement.geom::geography,
        ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
        :distance
      )
    `, {
            lat,
            lng,
            distance: distanceMeters
        })
            .getMany();
    }
    async findNearbyByCategory(lat, lng, distanceKm, categorie) {
        const distanceMeters = distanceKm * 1000;
        return this.etablissementSanteRepository
            .createQueryBuilder('etablissement')
            .where(`
      ST_DWithin(
        etablissement.geom::geography,
        ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
        :distance
      )
      AND etablissement.categorie ILIKE :categorie
    `, {
            lat,
            lng,
            distance: distanceMeters,
            categorie
        })
            .getMany();
    }
    async findByName(nom) {
        return this.etablissementSanteRepo.findByName(nom);
    }
    async updateEtablissement(id, updateData) {
        const etablissement = await this.etablissementSanteRepository.findOne({ where: { id } });
        if (!etablissement) {
            throw new common_1.NotFoundException(`Établissement avec l'ID ${id} introuvable.`);
        }
        Object.assign(etablissement, updateData);
        if (updateData.latitude !== undefined && updateData.longitude !== undefined) {
            etablissement.geom = {
                type: 'Point',
                coordinates: [updateData.longitude, updateData.latitude],
            };
        }
        return this.etablissementSanteRepository.save(etablissement);
    }
    async deleteEtablissement(id) {
        const result = await this.etablissementSanteRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Établissement avec l'ID ${id} introuvable.`);
        }
    }
};
exports.EtablissementSanteService = EtablissementSanteService;
exports.EtablissementSanteService = EtablissementSanteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(etablissement_sante_entity_1.EtablissementSante)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        etablissement_sante_repository_1.EtablissementSanteRepository])
], EtablissementSanteService);
//# sourceMappingURL=etablissement_sante.service.js.map