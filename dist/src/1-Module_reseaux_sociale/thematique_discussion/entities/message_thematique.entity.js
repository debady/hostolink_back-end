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
exports.MessageThematique = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../utilisateur/entities/user.entity");
const thematique_entity_1 = require("./thematique.entity");
const expert_sante_entity_1 = require("../../../user_etablissement_sante/entities/expert_sante.entity");
let MessageThematique = class MessageThematique {
};
exports.MessageThematique = MessageThematique;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MessageThematique.prototype, "id_message", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => thematique_entity_1.Thematique, (thematique) => thematique.messages, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_thematique_discussion' }),
    __metadata("design:type", thematique_entity_1.Thematique)
], MessageThematique.prototype, "thematique", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_expediteur' }),
    __metadata("design:type", user_entity_1.User)
], MessageThematique.prototype, "expediteur", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], MessageThematique.prototype, "contenu", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
    __metadata("design:type", String)
], MessageThematique.prototype, "type_message", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'date_envoi' }),
    __metadata("design:type", Date)
], MessageThematique.prototype, "date_envoi", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MessageThematique.prototype, "est_lu", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MessageThematique.prototype, "url_image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], MessageThematique.prototype, "nbre_like", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], MessageThematique.prototype, "status_reponse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expert_sante_entity_1.ExpertSante, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_expert' }),
    __metadata("design:type", expert_sante_entity_1.ExpertSante)
], MessageThematique.prototype, "expert", void 0);
exports.MessageThematique = MessageThematique = __decorate([
    (0, typeorm_1.Entity)('messages_thematique')
], MessageThematique);
//# sourceMappingURL=message_thematique.entity.js.map