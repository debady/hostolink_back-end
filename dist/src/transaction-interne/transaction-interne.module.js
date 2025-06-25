"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionInterneModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const transaction_interne_entity_1 = require("./entitie/transaction-interne.entity");
const transaction_interne_controller_1 = require("./transaction-interne.controller");
const transaction_interne_service_1 = require("./transaction-interne.service");
const compte_module_1 = require("../compte/compte.module");
const qr_code_module_1 = require("../qr-code/qr-code.module");
const user_module_1 = require("../utilisateur/user.module");
const transaction_frais_entity_1 = require("../transaction-frais/entite/transaction-frais.entity");
const notif_push_module_1 = require("../module_notification_push/notif_push.module");
let TransactionInterneModule = class TransactionInterneModule {
};
exports.TransactionInterneModule = TransactionInterneModule;
exports.TransactionInterneModule = TransactionInterneModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([transaction_interne_entity_1.Transaction, transaction_frais_entity_1.TransactionFrais]),
            (0, common_1.forwardRef)(() => compte_module_1.CompteModule),
            (0, common_1.forwardRef)(() => qr_code_module_1.QrCodeModule),
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            notif_push_module_1.NotificationModule
        ],
        controllers: [transaction_interne_controller_1.TransactionInterneController],
        providers: [transaction_interne_service_1.TransactionInterneService],
        exports: [transaction_interne_service_1.TransactionInterneService]
    })
], TransactionInterneModule);
//# sourceMappingURL=transaction-interne.module.js.map