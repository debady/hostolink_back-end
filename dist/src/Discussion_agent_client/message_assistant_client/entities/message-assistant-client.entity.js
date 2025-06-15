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
exports.MessageAssistantClient = void 0;
const typeorm_1 = require("typeorm");
const conversation_entity_1 = require("../../conversations/entities/conversation.entity");
const question_predefinie_entity_1 = require("../../questions_predefinies/entities/question-predefinie.entity");
const message_assistant_client_image_entity_1 = require("../../messages_assistant_client_image/entities/message-assistant-client-image.entity");
let MessageAssistantClient = class MessageAssistantClient {
};
exports.MessageAssistantClient = MessageAssistantClient;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'message_id' }),
    __metadata("design:type", Number)
], MessageAssistantClient.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'conversation_id' }),
    __metadata("design:type", Number)
], MessageAssistantClient.prototype, "conversationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'envoyer_par', length: 50 }),
    __metadata("design:type", String)
], MessageAssistantClient.prototype, "envoyerPar", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'message_text', type: 'text', nullable: true }),
    __metadata("design:type", String)
], MessageAssistantClient.prototype, "messageText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], MessageAssistantClient.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'question_predefinie', default: false }),
    __metadata("design:type", Boolean)
], MessageAssistantClient.prototype, "QuestionsPredefinies", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'question_sugerer', nullable: true }),
    __metadata("design:type", Number)
], MessageAssistantClient.prototype, "questionSugererId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_file', default: false }),
    __metadata("design:type", Boolean)
], MessageAssistantClient.prototype, "hasFile", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => conversation_entity_1.Conversation, conversation => conversation.messages),
    (0, typeorm_1.JoinColumn)({ name: 'conversation_id' }),
    __metadata("design:type", conversation_entity_1.Conversation)
], MessageAssistantClient.prototype, "conversation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => question_predefinie_entity_1.QuestionsPredefinies, question => question.messages, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'question_sugerer' }),
    __metadata("design:type", question_predefinie_entity_1.QuestionsPredefinies)
], MessageAssistantClient.prototype, "questionSugerer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_assistant_client_image_entity_1.MessageAssistantClientImage, image => image.message, { cascade: true }),
    __metadata("design:type", Array)
], MessageAssistantClient.prototype, "images", void 0);
exports.MessageAssistantClient = MessageAssistantClient = __decorate([
    (0, typeorm_1.Entity)('messages_assistant_client')
], MessageAssistantClient);
//# sourceMappingURL=message-assistant-client.entity.js.map