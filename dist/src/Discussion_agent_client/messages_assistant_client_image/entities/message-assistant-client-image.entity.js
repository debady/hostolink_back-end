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
exports.MessageAssistantClientImage = void 0;
const message_assistant_client_entity_1 = require("../../message_assistant_client/entities/message-assistant-client.entity");
const typeorm_1 = require("typeorm");
let MessageAssistantClientImage = class MessageAssistantClientImage {
};
exports.MessageAssistantClientImage = MessageAssistantClientImage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'image_id' }),
    __metadata("design:type", Number)
], MessageAssistantClientImage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'message_id' }),
    __metadata("design:type", Number)
], MessageAssistantClientImage.prototype, "messageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', type: 'text' }),
    __metadata("design:type", String)
], MessageAssistantClientImage.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alt_text', type: 'text', nullable: true }),
    __metadata("design:type", String)
], MessageAssistantClientImage.prototype, "altText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uploaded_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true }),
    __metadata("design:type", Date)
], MessageAssistantClientImage.prototype, "uploadedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => message_assistant_client_entity_1.MessageAssistantClient, message => message.images),
    (0, typeorm_1.JoinColumn)({ name: 'message_id' }),
    __metadata("design:type", message_assistant_client_entity_1.MessageAssistantClient)
], MessageAssistantClientImage.prototype, "message", void 0);
exports.MessageAssistantClientImage = MessageAssistantClientImage = __decorate([
    (0, typeorm_1.Entity)('messages_assistant_client_image')
], MessageAssistantClientImage);
//# sourceMappingURL=message-assistant-client-image.entity.js.map