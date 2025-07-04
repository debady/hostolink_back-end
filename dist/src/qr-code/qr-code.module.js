"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodeModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const qr_code_service_1 = require("./qr-code.service");
const qr_code_controller_1 = require("./qr-code.controller");
const qr_code_dynamique_entity_1 = require("./entitie/qr_code_dynamique.entity");
const qr_code_statique_entity_1 = require("./entitie/qr_code_statique.entity");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const cleanup_service_1 = require("./cleanup.service");
const schedule_1 = require("@nestjs/schedule");
const user_module_1 = require("../utilisateur/user.module");
const compte_module_1 = require("../compte/compte.module");
let QrCodeModule = class QrCodeModule {
};
exports.QrCodeModule = QrCodeModule;
exports.QrCodeModule = QrCodeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([qr_code_dynamique_entity_1.QrCodeDynamique, qr_code_statique_entity_1.QrCodeStatique]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_QR_SECRET', 'qr_code_secret_key'),
                    signOptions: { expiresIn: '1h' },
                }),
            }),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            schedule_1.ScheduleModule.forRoot(),
            (0, common_1.forwardRef)(() => compte_module_1.CompteModule),
        ],
        controllers: [qr_code_controller_1.QrCodeController],
        providers: [qr_code_service_1.QrCodeService, cleanup_service_1.CleanupService],
        exports: [qr_code_service_1.QrCodeService]
    })
], QrCodeModule);
//# sourceMappingURL=qr-code.module.js.map