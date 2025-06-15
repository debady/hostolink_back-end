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
exports.Administrateur = void 0;
const annonce_entity_1 = require("../../annonce/entities/annonce.entity");
const conversation_entity_1 = require("../../Discussion_agent_client/conversations/entities/conversation.entity");
const question_predefinie_entity_1 = require("../../Discussion_agent_client/questions_predefinies/entities/question-predefinie.entity");
const liste_numero_vert_etablissement_sante_entity_1 = require("../../liste_etablissement/entities/liste_numero_vert_etablissement_sante.entity");
const thematique_entity_1 = require("../../1-Module_reseaux_sociale/thematique_discussion/entities/thematique.entity");
const typeorm_1 = require("typeorm");
let Administrateur = class Administrateur {
};
exports.Administrateur = Administrateur;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Administrateur.prototype, "id_admin_gestionnaire", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true, nullable: false }),
    __metadata("design:type", String)
], Administrateur.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, unique: true, nullable: false }),
    __metadata("design:type", String)
], Administrateur.prototype, "telephone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Administrateur.prototype, "mot_de_passe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: false, default: 'admin' }),
    __metadata("design:type", String)
], Administrateur.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true, default: 'actif' }),
    __metadata("design:type", String)
], Administrateur.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, default: {} }),
    __metadata("design:type", Object)
], Administrateur.prototype, "permissions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Administrateur.prototype, "dernier_connexion", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Administrateur.prototype, "date_creation", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Administrateur.prototype, "date_modification", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => liste_numero_vert_etablissement_sante_entity_1.ListeNumeroEtablissementSante, (liste) => liste.administrateur, { cascade: true }),
    __metadata("design:type", Array)
], Administrateur.prototype, "liste_numero_vert", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => annonce_entity_1.Annonce, (annonce) => annonce.id_admin_gestionnaire),
    __metadata("design:type", Array)
], Administrateur.prototype, "annonces", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => thematique_entity_1.Thematique, (thematique) => thematique.administrateur),
    __metadata("design:type", Array)
], Administrateur.prototype, "thematiques_crees", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Administrateur.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Administrateur.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Administrateur.prototype, "adresse", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], Administrateur.prototype, "solde_de_rechargement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], Administrateur.prototype, "cumule_des_transactions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => question_predefinie_entity_1.QuestionsPredefinies, question => question.assistant),
    __metadata("design:type", Array)
], Administrateur.prototype, "questions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => conversation_entity_1.Conversation, conversation => conversation.assistant),
    __metadata("design:type", Array)
], Administrateur.prototype, "conversations", void 0);
exports.Administrateur = Administrateur = __decorate([
    (0, typeorm_1.Entity)('administrateurs')
], Administrateur);
//# sourceMappingURL=administrateur.entity.js.map