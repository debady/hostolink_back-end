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
exports.QrCodeDynamique = void 0;
const user_entity_1 = require("../../utilisateur/entities/user.entity");
const typeorm_1 = require("typeorm");
let QrCodeDynamique = class QrCodeDynamique {
};
exports.QrCodeDynamique = QrCodeDynamique;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], QrCodeDynamique.prototype, "id_qrcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16, nullable: true }),
    __metadata("design:type", String)
], QrCodeDynamique.prototype, "short_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], QrCodeDynamique.prototype, "id_user_etablissement_sante", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'uuid' }),
    __metadata("design:type", String)
], QrCodeDynamique.prototype, "id_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 1000 }),
    __metadata("design:type", String)
], QrCodeDynamique.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], QrCodeDynamique.prototype, "date_creation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], QrCodeDynamique.prototype, "date_expiration", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, default: 'actif' }),
    __metadata("design:type", String)
], QrCodeDynamique.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_user' }),
    __metadata("design:type", user_entity_1.User)
], QrCodeDynamique.prototype, "user", void 0);
exports.QrCodeDynamique = QrCodeDynamique = __decorate([
    (0, typeorm_1.Entity)('qr_code_paiement_dynamique')
], QrCodeDynamique);
//# sourceMappingURL=qr_code_dynamique.entity.js.map