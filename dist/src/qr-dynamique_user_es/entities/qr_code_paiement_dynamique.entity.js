"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodePaiementDynamique = void 0;
const typeorm_1 = require("typeorm");
let QrCodePaiementDynamique = class QrCodePaiementDynamique {
};
exports.QrCodePaiementDynamique = QrCodePaiementDynamique;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], QrCodePaiementDynamique.prototype, "id_qrcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16, nullable: true }),
    __metadata("design:type", String)
], QrCodePaiementDynamique.prototype, "short_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], QrCodePaiementDynamique.prototype, "qr_code_valeur", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], QrCodePaiementDynamique.prototype, "date_creation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], QrCodePaiementDynamique.prototype, "date_expiration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'actif' }),
    __metadata("design:type", String)
], QrCodePaiementDynamique.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 1000, nullable: true }),
    __metadata("design:type", String)
], QrCodePaiementDynamique.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], QrCodePaiementDynamique.prototype, "id_user_etablissement_sante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], QrCodePaiementDynamique.prototype, "id_user", void 0);
exports.QrCodePaiementDynamique = QrCodePaiementDynamique = __decorate([
    (0, typeorm_1.Entity)('qr_code_paiement_dynamique')
], QrCodePaiementDynamique);
//# sourceMappingURL=qr_code_paiement_dynamique.entity.js.map