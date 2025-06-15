"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdministrateurModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const administrateur_entity_1 = require("./entities/administrateur.entity");
const image_entity_1 = require("../image/entities/image.entity");
const administrateur_service_1 = require("./administrateur.service");
const administrateur_controller_1 = require("./administrateur.controller");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const gestion_utilisateur_module_1 = require("./Gest_utilisateurs/gestion_utilisateur.module");
let AdministrateurModule = class AdministrateurModule {
};
exports.AdministrateurModule = AdministrateurModule;
exports.AdministrateurModule = AdministrateurModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([administrateur_entity_1.Administrateur, image_entity_1.Image]),
            gestion_utilisateur_module_1.GestionUtilisateurModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1d' },
                }),
            }),
        ],
        controllers: [administrateur_controller_1.AdministrateurController],
        providers: [
            administrateur_service_1.AdministrateurService,
            {
                provide: 'CLOUDINARY',
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const cloudinary = require('cloudinary').v2;
                    cloudinary.config({
                        cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
                        api_key: configService.get('CLOUDINARY_API_KEY'),
                        api_secret: configService.get('CLOUDINARY_API_SECRET'),
                    });
                    return cloudinary;
                },
            },
        ],
        exports: [administrateur_service_1.AdministrateurService, jwt_1.JwtModule, typeorm_1.TypeOrmModule],
    })
], AdministrateurModule);
//# sourceMappingURL=administrateur.module.js.map