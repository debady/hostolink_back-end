"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageAssistantClientModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const message_assistant_client_entity_1 = require("./entities/message-assistant-client.entity");
const message_assistant_client_service_1 = require("./message_assistant_client.service");
const message_assistant_client_controller_1 = require("./message_assistant_client.controller");
const message_assistant_client_image_entity_1 = require("../messages_assistant_client_image/entities/message-assistant-client-image.entity");
const cloudinary_config_1 = require("../../../config/cloudinary.config");
const conversations_module_1 = require("../conversations/conversations.module");
let MessageAssistantClientModule = class MessageAssistantClientModule {
};
exports.MessageAssistantClientModule = MessageAssistantClientModule;
exports.MessageAssistantClientModule = MessageAssistantClientModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                message_assistant_client_entity_1.MessageAssistantClient,
                message_assistant_client_image_entity_1.MessageAssistantClientImage
            ]),
            (0, common_1.forwardRef)(() => conversations_module_1.ConversationsModule),
        ],
        controllers: [message_assistant_client_controller_1.MessageController],
        providers: [
            message_assistant_client_service_1.MessageService,
            cloudinary_config_1.CloudinaryService
        ],
        exports: [message_assistant_client_service_1.MessageService],
    })
], MessageAssistantClientModule);
//# sourceMappingURL=message_assistant_client.module.js.map