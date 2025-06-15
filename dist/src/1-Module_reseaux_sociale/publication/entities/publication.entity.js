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
exports.Publication = void 0;
const typeorm_1 = require("typeorm");
const commentaire_entity_1 = require("../../commentaire/entities/commentaire.entity");
const partage_entity_1 = require("../../partage/entities/partage.entity");
let Publication = class Publication {
};
exports.Publication = Publication;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Publication.prototype, "id_publication", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Publication.prototype, "titre_publication", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Publication.prototype, "contenu", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Publication.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Publication.prototype, "date_publication", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 0 }),
    __metadata("design:type", Number)
], Publication.prototype, "compteur_like", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Publication.prototype, "id_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Publication.prototype, "id_user_etablissement_sante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Publication.prototype, "id_admin_gestionnaire", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Publication.prototype, "id_expert", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => commentaire_entity_1.Commentaire, commentaire => commentaire.publication, { cascade: true }),
    __metadata("design:type", Array)
], Publication.prototype, "commentaires", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => partage_entity_1.Partage, partage => partage.publication, { cascade: true }),
    __metadata("design:type", Array)
], Publication.prototype, "partages", void 0);
exports.Publication = Publication = __decorate([
    (0, typeorm_1.Entity)('publication')
], Publication);
//# sourceMappingURL=publication.entity.js.map