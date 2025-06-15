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
exports.Conversation = void 0;
const agent_assistance_entity_1 = require("../../../agent-assistant/entities/agent-assistance.entity");
const message_assistant_client_entity_1 = require("../../message_assistant_client/entities/message-assistant-client.entity");
const user_etablissement_sante_entity_1 = require("../../../user_etablissement_sante/entities/user-etablissement-sante.entity");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../../utilisateur/entities/user.entity");
let Conversation = class Conversation {
};
exports.Conversation = Conversation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'conversation_id' }),
    __metadata("design:type", Number)
], Conversation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Conversation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_etablissement_sante', nullable: true }),
    __metadata("design:type", Number)
], Conversation.prototype, "etablissementSanteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assistant_id' }),
    __metadata("design:type", Number)
], Conversation.prototype, "assistantId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'start_time', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Conversation.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', length: 50, default: 'active' }),
    __metadata("design:type", String)
], Conversation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'auto_created', default: true }),
    __metadata("design:type", Boolean)
], Conversation.prototype, "autoCreated", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.conversations),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Conversation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agent_assistance_entity_1.AgentAssistance, assistant => assistant.conversations),
    (0, typeorm_1.JoinColumn)({ name: 'assistant_id' }),
    __metadata("design:type", agent_assistance_entity_1.AgentAssistance)
], Conversation.prototype, "assistant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_etablissement_sante_entity_1.UserEtablissementSante, etablissement => etablissement.conversations),
    (0, typeorm_1.JoinColumn)({ name: 'id_etablissement_sante' }),
    __metadata("design:type", user_etablissement_sante_entity_1.UserEtablissementSante)
], Conversation.prototype, "etablissementSante", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_assistant_client_entity_1.MessageAssistantClient, message => message.conversation),
    __metadata("design:type", Array)
], Conversation.prototype, "messages", void 0);
exports.Conversation = Conversation = __decorate([
    (0, typeorm_1.Entity)('conversations')
], Conversation);
//# sourceMappingURL=conversation.entity.js.map