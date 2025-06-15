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
exports.AgentAssistance = void 0;
const conversation_entity_1 = require("../../Discussion_agent_client/conversations/entities/conversation.entity");
const question_predefinie_entity_1 = require("../../Discussion_agent_client/questions_predefinies/entities/question-predefinie.entity");
const typeorm_1 = require("typeorm");
let AgentAssistance = class AgentAssistance {
};
exports.AgentAssistance = AgentAssistance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_agent_assistance' }),
    __metadata("design:type", Number)
], AgentAssistance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_admin_gestionnaire' }),
    __metadata("design:type", Number)
], AgentAssistance.prototype, "idAdminGestionnaire", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nom', length: 100 }),
    __metadata("design:type", String)
], AgentAssistance.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'prenom', length: 100 }),
    __metadata("design:type", String)
], AgentAssistance.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', length: 255, unique: true }),
    __metadata("design:type", String)
], AgentAssistance.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'telephone', length: 20, nullable: true }),
    __metadata("design:type", String)
], AgentAssistance.prototype, "telephone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mdp', length: 255 }),
    __metadata("design:type", String)
], AgentAssistance.prototype, "mdp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'statut', length: 20, default: 'actif' }),
    __metadata("design:type", String)
], AgentAssistance.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_creation', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AgentAssistance.prototype, "dateCreation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_modification', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AgentAssistance.prototype, "dateModification", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'url_photo_agent', length: 255, nullable: true }),
    __metadata("design:type", String)
], AgentAssistance.prototype, "urlPhotoAgent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => question_predefinie_entity_1.QuestionsPredefinies, question => question.assistant),
    __metadata("design:type", Array)
], AgentAssistance.prototype, "questions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => conversation_entity_1.Conversation, conversation => conversation.assistant),
    __metadata("design:type", Array)
], AgentAssistance.prototype, "conversations", void 0);
exports.AgentAssistance = AgentAssistance = __decorate([
    (0, typeorm_1.Entity)('agent_assistance')
], AgentAssistance);
//# sourceMappingURL=agent-assistance.entity.js.map