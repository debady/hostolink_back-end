"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrDynamiqueModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const qr_dynamique_controller_1 = require("./qr-dynamique.controller");
const qr_dynamique_service_es_1 = require("./qr-dynamique.service_es");
const qr_code_paiement_dynamique_entity_1 = require("./entities/qr_code_paiement_dynamique.entity");
const transaction_entity_1 = require("./entities/transaction.entity");
let QrDynamiqueModule = class QrDynamiqueModule {
};
exports.QrDynamiqueModule = QrDynamiqueModule;
exports.QrDynamiqueModule = QrDynamiqueModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([transaction_entity_1.Transaction, qr_code_paiement_dynamique_entity_1.QrCodePaiementDynamique])],
        controllers: [qr_dynamique_controller_1.QrDynamiqueController],
        providers: [qr_dynamique_service_es_1.QrDynamiqueService],
    })
], QrDynamiqueModule);
//# sourceMappingURL=qr-dynamique.module.js.map