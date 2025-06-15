"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListeNumeroEtablissementSanteModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const liste_numero_etablissement_sante_service_1 = require("./liste_numero_etablissement_sante.service");
const liste_numero_etablissement_sante_controller_1 = require("./liste_numero_etablissement_sante.controller");
const liste_numero_vert_etablissement_sante_entity_1 = require("./entities/liste_numero_vert_etablissement_sante.entity");
const cloudinary_module_1 = require("../upload/cloudinary.module");
const administrateur_module_1 = require("../administrateur/administrateur.module");
const cloudinary_service_1 = require("../upload/cloudinary.service");
let ListeNumeroEtablissementSanteModule = class ListeNumeroEtablissementSanteModule {
};
exports.ListeNumeroEtablissementSanteModule = ListeNumeroEtablissementSanteModule;
exports.ListeNumeroEtablissementSanteModule = ListeNumeroEtablissementSanteModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([liste_numero_vert_etablissement_sante_entity_1.ListeNumeroEtablissementSante]), cloudinary_module_1.CloudinaryModule, administrateur_module_1.AdministrateurModule,],
        controllers: [liste_numero_etablissement_sante_controller_1.ListeNumeroEtablissementSanteController],
        providers: [liste_numero_etablissement_sante_service_1.ListeNumeroEtablissementSanteService, cloudinary_service_1.CloudinaryService],
    })
], ListeNumeroEtablissementSanteModule);
//# sourceMappingURL=liste_numero_etablissement_sante.module.js.map