"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesAssistantClientImageModule = void 0;
const common_1 = require("@nestjs/common");
const messages_assistant_client_image_service_1 = require("./messages_assistant_client_image.service");
const messages_assistant_client_image_controller_1 = require("./messages_assistant_client_image.controller");
let MessagesAssistantClientImageModule = class MessagesAssistantClientImageModule {
};
exports.MessagesAssistantClientImageModule = MessagesAssistantClientImageModule;
exports.MessagesAssistantClientImageModule = MessagesAssistantClientImageModule = __decorate([
    (0, common_1.Module)({
        providers: [messages_assistant_client_image_service_1.MessagesAssistantClientImageService],
        controllers: [messages_assistant_client_image_controller_1.MessagesAssistantClientImageController]
    })
], MessagesAssistantClientImageModule);
//# sourceMappingURL=messages_assistant_client_image.module.js.map