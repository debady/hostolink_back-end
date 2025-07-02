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
exports.UserEtablissementSante = void 0;
const typeorm_1 = require("typeorm");
const code_verif_otp_entity_1 = require("./code-verif-otp.entity");
const raison_suppression_entity_1 = require("./raison-suppression.entity");
const expert_sante_entity_1 = require("./expert_sante.entity");
const conversation_entity_1 = require("../../Discussion_agent_client/conversations/entities/conversation.entity");
let UserEtablissementSante = class UserEtablissementSante {
};
exports.UserEtablissementSante = UserEtablissementSante;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserEtablissementSante.prototype, "id_user_etablissement_sante", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], UserEtablissementSante.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], UserEtablissementSante.prototype, "telephone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], UserEtablissementSante.prototype, "categorie", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], UserEtablissementSante.prototype, "adresse", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creat_at' }),
    __metadata("design:type", Date)
], UserEtablissementSante.prototype, "creatAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: true }),
    __metadata("design:type", Number)
], UserEtablissementSante.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: true }),
    __metadata("design:type", Number)
], UserEtablissementSante.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326, nullable: true }),
    __metadata("design:type", Object)
], UserEtablissementSante.prototype, "geom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], UserEtablissementSante.prototype, "specialites", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], UserEtablissementSante.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], UserEtablissementSante.prototype, "mot_de_passe", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UserEtablissementSante.prototype, "compte_verifie", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], UserEtablissementSante.prototype, "numero_wave", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserEtablissementSante.prototype, "wave_verified", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => code_verif_otp_entity_1.CodeVerifOtp, (otp) => otp.userEtablissementSante),
    __metadata("design:type", Array)
], UserEtablissementSante.prototype, "otps", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => raison_suppression_entity_1.RaisonSuppressionCompte, (r) => r.userEtablissementSante),
    __metadata("design:type", Array)
], UserEtablissementSante.prototype, "raisons", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => expert_sante_entity_1.ExpertSante, (expert) => expert.user_etablissement_sante),
    __metadata("design:type", Array)
], UserEtablissementSante.prototype, "experts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => conversation_entity_1.Conversation, conversation => conversation.etablissementSante),
    __metadata("design:type", Array)
], UserEtablissementSante.prototype, "conversations", void 0);
exports.UserEtablissementSante = UserEtablissementSante = __decorate([
    (0, typeorm_1.Entity)('user_etablissement_sante')
], UserEtablissementSante);
//# sourceMappingURL=user-etablissement-sante.entity.js.map