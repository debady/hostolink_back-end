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
exports.QuestionsPredefinies = void 0;
const agent_assistance_entity_1 = require("../../../agent-assistant/entities/agent-assistance.entity");
const message_assistant_client_entity_1 = require("../../message_assistant_client/entities/message-assistant-client.entity");
const typeorm_1 = require("typeorm");
let QuestionsPredefinies = class QuestionsPredefinies {
};
exports.QuestionsPredefinies = QuestionsPredefinies;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'question_id' }),
    __metadata("design:type", Number)
], QuestionsPredefinies.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'question_text', type: 'text' }),
    __metadata("design:type", String)
], QuestionsPredefinies.prototype, "questionText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assistant_id' }),
    __metadata("design:type", Number)
], QuestionsPredefinies.prototype, "assistantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category', length: 255, nullable: true }),
    __metadata("design:type", String)
], QuestionsPredefinies.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true, nullable: true }),
    __metadata("design:type", Boolean)
], QuestionsPredefinies.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agent_assistance_entity_1.AgentAssistance, assistant => assistant.questions),
    (0, typeorm_1.JoinColumn)({ name: 'assistant_id' }),
    __metadata("design:type", agent_assistance_entity_1.AgentAssistance)
], QuestionsPredefinies.prototype, "assistant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_assistant_client_entity_1.MessageAssistantClient, message => message.questionSugerer),
    __metadata("design:type", Array)
], QuestionsPredefinies.prototype, "messages", void 0);
exports.QuestionsPredefinies = QuestionsPredefinies = __decorate([
    (0, typeorm_1.Entity)('questions_predefinies')
], QuestionsPredefinies);
//# sourceMappingURL=question-predefinie.entity.js.map