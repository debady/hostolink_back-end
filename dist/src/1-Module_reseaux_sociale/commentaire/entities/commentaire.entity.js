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
exports.Commentaire = void 0;
const typeorm_1 = require("typeorm");
const publication_entity_1 = require("../../publication/entities/publication.entity");
let Commentaire = class Commentaire {
};
exports.Commentaire = Commentaire;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Commentaire.prototype, "id_commentaire", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Commentaire.prototype, "contenu", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Commentaire.prototype, "date_commentaire", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => publication_entity_1.Publication, publication => publication.commentaires, {
        nullable: false,
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)({ name: 'id_publication' }),
    __metadata("design:type", publication_entity_1.Publication)
], Commentaire.prototype, "publication", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Commentaire.prototype, "id_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Commentaire.prototype, "id_user_etablissement_sante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Commentaire.prototype, "id_admin_gestionnaire", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Commentaire.prototype, "id_expert", void 0);
exports.Commentaire = Commentaire = __decorate([
    (0, typeorm_1.Entity)('commentaire')
], Commentaire);
//# sourceMappingURL=commentaire.entity.js.map