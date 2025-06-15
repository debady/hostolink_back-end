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
exports.Partage = void 0;
const typeorm_1 = require("typeorm");
const publication_entity_1 = require("../../publication/entities/publication.entity");
let Partage = class Partage {
};
exports.Partage = Partage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Partage.prototype, "id_partage", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => publication_entity_1.Publication, publication => publication.partages, {
        nullable: false,
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({ name: 'id_publication' }),
    __metadata("design:type", publication_entity_1.Publication)
], Partage.prototype, "publication", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Partage.prototype, "lien_partage", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Partage.prototype, "date_partage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Partage.prototype, "plateforme_partage", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Partage.prototype, "nombre_clics", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Partage.prototype, "id_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Partage.prototype, "id_user_etablissement_sante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Partage.prototype, "id_admin_gestionnaire", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Partage.prototype, "id_expert", void 0);
exports.Partage = Partage = __decorate([
    (0, typeorm_1.Entity)('partage')
], Partage);
//# sourceMappingURL=partage.entity.js.map