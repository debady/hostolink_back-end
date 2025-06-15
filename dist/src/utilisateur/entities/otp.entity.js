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
exports.Otp = exports.MoyenEnvoiEnum = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../utilisateur/entities/user.entity");
var MoyenEnvoiEnum;
(function (MoyenEnvoiEnum) {
    MoyenEnvoiEnum["SMS"] = "SMS";
    MoyenEnvoiEnum["EMAIL"] = "email";
    MoyenEnvoiEnum["TELEPHONE"] = "TELEPHONE";
})(MoyenEnvoiEnum || (exports.MoyenEnvoiEnum = MoyenEnvoiEnum = {}));
let Otp = class Otp {
};
exports.Otp = Otp;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Otp.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.otps, { onDelete: 'CASCADE', nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_user' }),
    __metadata("design:type", user_entity_1.User)
], Otp.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, default: null }),
    __metadata("design:type", Object)
], Otp.prototype, "id_user_etablissement_sante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 4, nullable: false }),
    __metadata("design:type", String)
], Otp.prototype, "otp_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: MoyenEnvoiEnum, nullable: false }),
    __metadata("design:type", String)
], Otp.prototype, "moyen_envoyer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Otp.prototype, "expires_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], Otp.prototype, "is_valid", void 0);
exports.Otp = Otp = __decorate([
    (0, typeorm_1.Entity)('code_verif_otp')
], Otp);
//# sourceMappingURL=otp.entity.js.map