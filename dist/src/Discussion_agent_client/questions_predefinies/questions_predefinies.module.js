"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsPredefiniesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const message_assistant_client_entity_1 = require("../message_assistant_client/entities/message-assistant-client.entity");
const message_assistant_client_controller_1 = require("../message_assistant_client/message_assistant_client.controller");
const message_assistant_client_service_1 = require("../message_assistant_client/message_assistant_client.service");
const message_assistant_client_image_entity_1 = require("../messages_assistant_client_image/entities/message-assistant-client-image.entity");
const cloudinary_config_1 = require("../../../config/cloudinary.config");
const cloudinary_module_1 = require("../../upload/cloudinary.module");
const questions_predefinies_controller_1 = require("./questions_predefinies.controller");
const questions_predefinies_service_1 = require("./questions_predefinies.service");
const question_predefinie_entity_1 = require("./entities/question-predefinie.entity");
const conversations_module_1 = require("../conversations/conversations.module");
let QuestionsPredefiniesModule = class QuestionsPredefiniesModule {
};
exports.QuestionsPredefiniesModule = QuestionsPredefiniesModule;
exports.QuestionsPredefiniesModule = QuestionsPredefiniesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                question_predefinie_entity_1.QuestionsPredefinies,
                message_assistant_client_entity_1.MessageAssistantClient,
                message_assistant_client_image_entity_1.MessageAssistantClientImage,
                cloudinary_config_1.CloudinaryService,
                cloudinary_module_1.CloudinaryModule,
            ]),
            (0, common_1.forwardRef)(() => conversations_module_1.ConversationsModule),
        ],
        controllers: [message_assistant_client_controller_1.MessageController, questions_predefinies_controller_1.QuestionController],
        providers: [questions_predefinies_service_1.QuestionService, message_assistant_client_service_1.MessageService, cloudinary_config_1.CloudinaryService,],
        exports: [questions_predefinies_service_1.QuestionService],
    })
], QuestionsPredefiniesModule);
//# sourceMappingURL=questions_predefinies.module.js.map