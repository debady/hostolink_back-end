"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const user_service_1 = require("./user.service");
const user_controller_1 = require("./user.controller");
const image_service_1 = require("../image/image.service");
const image_entity_1 = require("../image/entities/image.entity");
const compte_module_1 = require("../compte/compte.module");
const qr_code_module_1 = require("../qr-code/qr-code.module");
const otp_entity_1 = require("./entities/otp.entity");
const email_service_1 = require("./email.service");
const nettoyeur_service_1 = require("./nettoyeur.service");
const auth_module_1 = require("../auth/auth.module");
const sms_module_1 = require("./sms.module");
const dreams_houses_email_module_1 = require("../email/dreams-houses-email.module");
const notif_push_module_1 = require("../module_notification_push/notif_push.module");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, image_entity_1.Image, otp_entity_1.Otp, notif_push_module_1.NotifPushModule]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            sms_module_1.SmsModule,
            dreams_houses_email_module_1.EmailModule,
            (0, common_1.forwardRef)(() => compte_module_1.CompteModule),
            (0, common_1.forwardRef)(() => qr_code_module_1.QrCodeModule),
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, image_service_1.ImageService, email_service_1.EmailService, nettoyeur_service_1.OtpCleanerService],
        exports: [user_service_1.UserService, typeorm_1.TypeOrmModule],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map