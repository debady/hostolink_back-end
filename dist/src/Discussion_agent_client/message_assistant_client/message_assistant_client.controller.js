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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const message_assistant_client_service_1 = require("./message_assistant_client.service");
const cloudinary_config_1 = require("../../../config/cloudinary.config");
const message_dto_1 = require("./dto/message.dto");
const multer_config_1 = require("../../../config/multer.config");
let MessageController = class MessageController {
    constructor(messageService, cloudinaryService) {
        this.messageService = messageService;
        this.cloudinaryService = cloudinaryService;
    }
    async findByConversation(conversationId) {
        return this.messageService.findByConversation(+conversationId);
    }
    async getLastMessages(conversationId, limit) {
        return this.messageService.getLastMessagesByConversation(+conversationId, limit ? +limit : 10);
    }
    async countByConversation(conversationId) {
        const count = await this.messageService.countByConversation(+conversationId);
        return { count };
    }
    async findOne(id) {
        return this.messageService.findOne(+id);
    }
    async create(createMessageDto) {
        return this.messageService.create(createMessageDto);
    }
    async createWithImage(createMessageDto, file) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        const messageWithImageDto = {
            ...createMessageDto,
            images: [
                {
                    imageUrl: imageUrl,
                    altText: file.originalname,
                },
            ],
        };
        return this.messageService.createWithImage(messageWithImageDto);
    }
    async addImageToMessage(id, file) {
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        const createImageDto = {
            messageId: +id,
            imageUrl: imageUrl,
            altText: file.originalname,
        };
        return this.messageService.addImageToMessage(+id, createImageDto);
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Get)('conversation/:conversationId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "findByConversation", null);
__decorate([
    (0, common_1.Get)('conversation/:conversationId/last'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('conversationId')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getLastMessages", null);
__decorate([
    (0, common_1.Get)('conversation/:conversationId/count'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "countByConversation", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('with-image'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', multer_config_1.multerOptions)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_dto_1.CreateMessageDto, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createWithImage", null);
__decorate([
    (0, common_1.Post)(':id/add-image'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "addImageToMessage", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [message_assistant_client_service_1.MessageService,
        cloudinary_config_1.CloudinaryService])
], MessageController);
//# sourceMappingURL=message_assistant_client.controller.js.map