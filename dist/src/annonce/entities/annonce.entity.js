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
exports.Annonce = void 0;
const administrateur_entity_1 = require("../../administrateur/entities/administrateur.entity");
const typeorm_1 = require("typeorm");
let Annonce = class Annonce {
};
exports.Annonce = Annonce;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Annonce.prototype, "id_annonce", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => administrateur_entity_1.Administrateur, (admin) => admin.annonces, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_admin_gestionnaire' }),
    __metadata("design:type", administrateur_entity_1.Administrateur)
], Annonce.prototype, "id_admin_gestionnaire", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Annonce.prototype, "titre_annonce", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Annonce.prototype, "description_annonce", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Annonce.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Annonce.prototype, "url_images", void 0);
exports.Annonce = Annonce = __decorate([
    (0, typeorm_1.Entity)('annonce')
], Annonce);
//# sourceMappingURL=annonce.entity.js.map