"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const user_module_1 = require("./user/user.module");
const user_entity_1 = require("./user/entities/user.entity");
const auth_module_1 = require("./auth/auth.module");
const image_module_1 = require("./image/image.module");
const publication_module_1 = require("./publication/publication.module");
const commentaire_module_1 = require("./commentaire/commentaire.module");
const partage_module_1 = require("./partage/partage.module");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const etablissement_sante_module_1 = require("./etablissement_sante/etablissement_sante.module");
const commentaire_entity_1 = require("./commentaire/entities/commentaire.entity");
const otp_entity_1 = require("./otp/entities/otp.entity");
const publication_entity_1 = require("./publication/entities/publication.entity");
const partage_entity_1 = require("./partage/entities/partage.entity");
const image_entity_1 = require("./image/entities/image.entity");
const etablissement_sante_entity_1 = require("./etablissement_sante/entities/etablissement_sante.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DATABASE_HOST || 'localhost',
                port: Number(process.env.DATABASE_PORT) || 5432,
                username: process.env.DATABASE_USER || 'postgres',
                password: process.env.DATABASE_PASSWORD || 'NGUESSAN',
                database: process.env.DATABASE_NAME || 'hostolink_bd',
                autoLoadEntities: false,
                synchronize: true,
                entities: [user_entity_1.User, commentaire_entity_1.Commentaire, otp_entity_1.Otp, publication_entity_1.Publication, partage_entity_1.Partage, image_entity_1.Image, etablissement_sante_entity_1.EtablissementSante,],
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            image_module_1.ImageModule,
            publication_module_1.PublicationModule,
            commentaire_module_1.CommentaireModule,
            partage_module_1.PartageModule,
            etablissement_sante_module_1.EtablissementSanteModule,
            etablissement_sante_module_1.EtablissementSanteModule
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map