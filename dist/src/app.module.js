"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./user/user.module");
const auth_module_1 = require("./auth/auth.module");
const image_module_1 = require("./image/image.module");
const publication_module_1 = require("./publication/publication.module");
const commentaire_module_1 = require("./commentaire/commentaire.module");
const partage_module_1 = require("./partage/partage.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                autoLoadEntities: true,
                synchronize: false,
                migrations: [__dirname + '/migrations/*{.ts,.js}'],
                migrationsRun: true,
                logging: process.env.NODE_ENV !== 'production',
                extra: process.env.DB_SSL === 'true'
                    ? { ssl: { rejectUnauthorized: false } }
                    : undefined,
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            image_module_1.ImageModule,
            publication_module_1.PublicationModule,
            commentaire_module_1.CommentaireModule,
            partage_module_1.PartageModule,
        ],
    })
], AppModule);
console.log('📌 Connexion à PostgreSQL avec URL :', process.env.DB_HOST);
//# sourceMappingURL=app.module.js.map