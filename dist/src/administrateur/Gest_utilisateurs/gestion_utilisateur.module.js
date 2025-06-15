"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestionUtilisateurModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../utilisateur/entities/user.entity");
const gest_utilisateur_controller_1 = require("./gest_utilisateur.controller");
const gest_utilisateur_service_1 = require("./gest_utilisateur.service");
let GestionUtilisateurModule = class GestionUtilisateurModule {
};
exports.GestionUtilisateurModule = GestionUtilisateurModule;
exports.GestionUtilisateurModule = GestionUtilisateurModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User])],
        controllers: [gest_utilisateur_controller_1.GestUtilisateurController],
        providers: [gest_utilisateur_service_1.GestUtilisateurService],
    })
], GestionUtilisateurModule);
//# sourceMappingURL=gestion_utilisateur.module.js.map