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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtablissementSanteRepository = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const etablissement_sante_entity_1 = require("../entities/etablissement_sante.entity");
let EtablissementSanteRepository = class EtablissementSanteRepository extends typeorm_1.Repository {
    constructor(dataSource) {
        super(etablissement_sante_entity_1.EtablissementSante, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findNearby(lat, lng, distance) {
        return this.dataSource.getRepository(etablissement_sante_entity_1.EtablissementSante)
            .createQueryBuilder('etablissement')
            .where(`ST_DWithin(geom::geography, ST_MakePoint(:lng, :lat)::geography, :distance)`)
            .setParameters({ lat, lng, distance })
            .getMany();
    }
    async findNearbyByCategory(lat, lng, distance, categorie) {
        return this.dataSource.getRepository(etablissement_sante_entity_1.EtablissementSante)
            .createQueryBuilder('etablissement')
            .where(`ST_DWithin(geom::geography, ST_MakePoint(:lng, :lat)::geography, :distance)
              AND categorie ILIKE :categorie`)
            .setParameters({ lat, lng, distance, categorie: `%${categorie}%` })
            .getMany();
    }
    async findByName(nom) {
        return this.dataSource.getRepository(etablissement_sante_entity_1.EtablissementSante)
            .createQueryBuilder('etablissement')
            .where(`etablissement.nom ILIKE :nom`, { nom: `%${nom}%` })
            .getMany();
    }
};
exports.EtablissementSanteRepository = EtablissementSanteRepository;
exports.EtablissementSanteRepository = EtablissementSanteRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], EtablissementSanteRepository);
//# sourceMappingURL=etablissement_sante.repository.js.map