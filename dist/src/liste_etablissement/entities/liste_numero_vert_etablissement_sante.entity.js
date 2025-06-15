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
exports.ListeNumeroEtablissementSante = void 0;
const administrateur_entity_1 = require("../../administrateur/entities/administrateur.entity");
const typeorm_1 = require("typeorm");
let ListeNumeroEtablissementSante = class ListeNumeroEtablissementSante {
};
exports.ListeNumeroEtablissementSante = ListeNumeroEtablissementSante;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ListeNumeroEtablissementSante.prototype, "id_liste_num_etablissement_sante", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => administrateur_entity_1.Administrateur, (admin) => admin.liste_numero_vert, { nullable: false, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_admin_gestionnaire' }),
    __metadata("design:type", administrateur_entity_1.Administrateur)
], ListeNumeroEtablissementSante.prototype, "administrateur", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], ListeNumeroEtablissementSante.prototype, "nom_etablissement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: false }),
    __metadata("design:type", String)
], ListeNumeroEtablissementSante.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ListeNumeroEtablissementSante.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], ListeNumeroEtablissementSante.prototype, "presentation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], ListeNumeroEtablissementSante.prototype, "adresse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: false }),
    __metadata("design:type", Number)
], ListeNumeroEtablissementSante.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: false }),
    __metadata("design:type", Number)
], ListeNumeroEtablissementSante.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], ListeNumeroEtablissementSante.prototype, "type_etablissement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], ListeNumeroEtablissementSante.prototype, "site_web", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: false, default: 'Autre' }),
    __metadata("design:type", String)
], ListeNumeroEtablissementSante.prototype, "categorie", void 0);
exports.ListeNumeroEtablissementSante = ListeNumeroEtablissementSante = __decorate([
    (0, typeorm_1.Entity)('liste_numero_vert_etablissement_sante')
], ListeNumeroEtablissementSante);
//# sourceMappingURL=liste_numero_vert_etablissement_sante.entity.js.map