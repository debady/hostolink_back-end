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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const image_entity_1 = require("../../image/entities/image.entity");
const message_thematique_entity_1 = require("../../1-Module_reseaux_sociale/thematique_discussion/entities/message_thematique.entity");
const otp_entity_1 = require("./otp.entity");
const conversation_entity_1 = require("../../Discussion_agent_client/conversations/entities/conversation.entity");
const documents_identite_entity_1 = require("../../documents_identite/entities/documents_identite.entity");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "telephone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "mdp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "pays", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], User.prototype, "date_inscription", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "dernier_otp_envoye", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "raison_banni", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "compte_verifier", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => otp_entity_1.Otp, otp => otp.user, { cascade: true, nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "otps", void 0);
__decorate([
    (0, typeorm_1.Column)('geometry', { spatialFeatureType: 'Point', srid: 4326, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "position", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => image_entity_1.Image, (image) => image.user, { cascade: true }),
    __metadata("design:type", Array)
], User.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "actif", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_thematique_entity_1.MessageThematique, (message) => message.expediteur),
    __metadata("design:type", Array)
], User.prototype, "messagesEnvoyes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "fcm_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "code_invitation_utilise", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => conversation_entity_1.Conversation, conversation => conversation.user),
    __metadata("design:type", Array)
], User.prototype, "conversations", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => documents_identite_entity_1.DocumentsIdentiteEntity, document => document.user, { eager: true }),
    __metadata("design:type", documents_identite_entity_1.DocumentsIdentiteEntity)
], User.prototype, "document_identite", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('utilisateur')
], User);
//# sourceMappingURL=user.entity.js.map