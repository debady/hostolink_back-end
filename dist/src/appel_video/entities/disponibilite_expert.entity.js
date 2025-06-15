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
exports.DisponibiliteExpert = void 0;
const expert_sante_entity_1 = require("../../user_etablissement_sante/entities/expert_sante.entity");
const typeorm_1 = require("typeorm");
let DisponibiliteExpert = class DisponibiliteExpert {
};
exports.DisponibiliteExpert = DisponibiliteExpert;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], DisponibiliteExpert.prototype, "id_expert", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => expert_sante_entity_1.ExpertSante, { eager: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_expert' }),
    __metadata("design:type", expert_sante_entity_1.ExpertSante)
], DisponibiliteExpert.prototype, "expert", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DisponibiliteExpert.prototype, "est_connecte", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], DisponibiliteExpert.prototype, "derniere_connexion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], DisponibiliteExpert.prototype, "zone_couverte", void 0);
exports.DisponibiliteExpert = DisponibiliteExpert = __decorate([
    (0, typeorm_1.Entity)('disponibilite_expert')
], DisponibiliteExpert);
//# sourceMappingURL=disponibilite_expert.entity.js.map