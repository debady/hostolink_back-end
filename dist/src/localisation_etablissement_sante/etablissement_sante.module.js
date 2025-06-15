"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtablissementSanteModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const etablissement_sante_entity_1 = require("./entities/etablissement_sante.entity");
const etablissement_sante_service_1 = require("./etablissement_sante.service");
const etablissement_sante_controller_1 = require("./etablissement_sante.controller");
const etablissement_sante_repository_1 = require("./repository/etablissement_sante.repository");
let EtablissementSanteModule = class EtablissementSanteModule {
};
exports.EtablissementSanteModule = EtablissementSanteModule;
exports.EtablissementSanteModule = EtablissementSanteModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([etablissement_sante_entity_1.EtablissementSante])],
        providers: [
            etablissement_sante_service_1.EtablissementSanteService,
            etablissement_sante_repository_1.EtablissementSanteRepository,
        ],
        controllers: [etablissement_sante_controller_1.EtablissementSanteController],
        exports: [
            etablissement_sante_service_1.EtablissementSanteService,
            etablissement_sante_repository_1.EtablissementSanteRepository,
            typeorm_1.TypeOrmModule,
        ],
    })
], EtablissementSanteModule);
//# sourceMappingURL=etablissement_sante.module.js.map