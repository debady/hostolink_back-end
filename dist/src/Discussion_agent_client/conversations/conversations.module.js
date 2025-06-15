"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const conversation_entity_1 = require("./entities/conversation.entity");
const questions_predefinies_service_1 = require("../questions_predefinies/questions_predefinies.service");
const message_assistant_client_entity_1 = require("../message_assistant_client/entities/message-assistant-client.entity");
const question_predefinie_entity_1 = require("../questions_predefinies/entities/question-predefinie.entity");
const conversations_controller_1 = require("./conversations.controller");
const conversations_service_1 = require("./conversations.service");
const message_assistant_client_module_1 = require("../message_assistant_client/message_assistant_client.module");
const agent_assistant_module_1 = require("../../agent-assistant/agent-assistant.module");
let ConversationsModule = class ConversationsModule {
};
exports.ConversationsModule = ConversationsModule;
exports.ConversationsModule = ConversationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                conversation_entity_1.Conversation,
                message_assistant_client_entity_1.MessageAssistantClient,
                question_predefinie_entity_1.QuestionsPredefinies,
            ]),
            agent_assistant_module_1.AgentAssistantModule,
            (0, common_1.forwardRef)(() => message_assistant_client_module_1.MessageAssistantClientModule),
        ],
        controllers: [conversations_controller_1.ConversationController],
        providers: [conversations_service_1.ConversationService, questions_predefinies_service_1.QuestionService],
        exports: [conversations_service_1.ConversationService],
    })
], ConversationsModule);
//# sourceMappingURL=conversations.module.js.map