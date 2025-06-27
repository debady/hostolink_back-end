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
exports.Compte = exports.TypeUserEnum = void 0;
const user_entity_1 = require("../../utilisateur/entities/user.entity");
const typeorm_1 = require("typeorm");
var TypeUserEnum;
(function (TypeUserEnum) {
    TypeUserEnum["UTILISATEUR"] = "utilisateur";
    TypeUserEnum["ETABLISSEMENT"] = "etablissement";
})(TypeUserEnum || (exports.TypeUserEnum = TypeUserEnum = {}));
let Compte = class Compte {
};
exports.Compte = Compte;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Compte.prototype, "id_compte", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Compte.prototype, "solde_compte", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Compte.prototype, "solde_bonus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Compte.prototype, "cumule_mensuel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 2000000 }),
    __metadata("design:type", Number)
], Compte.prototype, "plafond", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Compte.prototype, "mode_paiement_preferentiel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], Compte.prototype, "type_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'XOF' }),
    __metadata("design:type", String)
], Compte.prototype, "devise", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true, unique: true }),
    __metadata("design:type", String)
], Compte.prototype, "numero_compte", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Compte.prototype, "date_creation_compte", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Compte.prototype, "date_modification", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'actif' }),
    __metadata("design:type", String)
], Compte.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Compte.prototype, "id_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Compte.prototype, "id_user_etablissement_sante", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_user' }),
    __metadata("design:type", user_entity_1.User)
], Compte.prototype, "user", void 0);
exports.Compte = Compte = __decorate([
    (0, typeorm_1.Entity)('compte'),
    (0, typeorm_1.Check)(`type_user IN ('${TypeUserEnum.UTILISATEUR}', '${TypeUserEnum.ETABLISSEMENT}')`)
], Compte);
//# sourceMappingURL=compte.entity.js.map