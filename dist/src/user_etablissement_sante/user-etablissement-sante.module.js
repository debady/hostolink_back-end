"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEtablissementSanteModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_etablissement_sante_service_1 = require("./user-etablissement-sante.service");
const user_etablissement_sante_controller_1 = require("./user-etablissement-sante.controller");
const user_etablissement_sante_entity_1 = require("./entities/user-etablissement-sante.entity");
const code_verif_otp_entity_1 = require("./entities/code-verif-otp.entity");
const raison_suppression_entity_1 = require("./entities/raison-suppression.entity");
const jwt_etablissement_strategy_1 = require("../auth/jwt-etablissement.strategy");
const image_entity_1 = require("../image/entities/image.entity");
const email_module_1 = require("../utilisateur/email.module");
let UserEtablissementSanteModule = class UserEtablissementSanteModule {
};
exports.UserEtablissementSanteModule = UserEtablissementSanteModule;
exports.UserEtablissementSanteModule = UserEtablissementSanteModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_etablissement_sante_entity_1.UserEtablissementSante, code_verif_otp_entity_1.CodeVerifOtp, raison_suppression_entity_1.RaisonSuppressionCompte, image_entity_1.Image]),
            email_module_1.EmailModule,
        ],
        controllers: [user_etablissement_sante_controller_1.UserEtablissementSanteController],
        providers: [user_etablissement_sante_service_1.UserEtablissementSanteService, jwt_etablissement_strategy_1.JwtEtablissementStrategy],
        exports: [typeorm_1.TypeOrmModule],
    })
], UserEtablissementSanteModule);
//# sourceMappingURL=user-etablissement-sante.module.js.map