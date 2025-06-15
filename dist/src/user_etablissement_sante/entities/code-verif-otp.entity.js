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
exports.CodeVerifOtp = void 0;
const typeorm_1 = require("typeorm");
const user_etablissement_sante_entity_1 = require("./user-etablissement-sante.entity");
let CodeVerifOtp = class CodeVerifOtp {
};
exports.CodeVerifOtp = CodeVerifOtp;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CodeVerifOtp.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 6 }),
    __metadata("design:type", String)
], CodeVerifOtp.prototype, "otp_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], CodeVerifOtp.prototype, "expires_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], CodeVerifOtp.prototype, "is_valid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_etablissement_sante_entity_1.UserEtablissementSante, (user) => user.otps, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_user_etablissement_sante' }),
    __metadata("design:type", user_etablissement_sante_entity_1.UserEtablissementSante)
], CodeVerifOtp.prototype, "userEtablissementSante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], CodeVerifOtp.prototype, "moyen_envoyer", void 0);
exports.CodeVerifOtp = CodeVerifOtp = __decorate([
    (0, typeorm_1.Entity)('code_verif_otp')
], CodeVerifOtp);
//# sourceMappingURL=code-verif-otp.entity.js.map