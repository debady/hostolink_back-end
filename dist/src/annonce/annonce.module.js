"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnonceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const annonce_service_1 = require("./annonce.service");
const annonce_controller_1 = require("./annonce.controller");
const annonce_entity_1 = require("./entities/annonce.entity");
const administrateur_entity_1 = require("../administrateur/entities/administrateur.entity");
const administrateur_module_1 = require("../administrateur/administrateur.module");
const upload_module_1 = require("./image/upload.module");
let AnnonceModule = class AnnonceModule {
};
exports.AnnonceModule = AnnonceModule;
exports.AnnonceModule = AnnonceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([annonce_entity_1.Annonce, administrateur_entity_1.Administrateur]),
            administrateur_module_1.AdministrateurModule,
            upload_module_1.UploadModule,
        ],
        controllers: [annonce_controller_1.AnnonceController],
        providers: [annonce_service_1.AnnonceService],
    })
], AnnonceModule);
//# sourceMappingURL=annonce.module.js.map