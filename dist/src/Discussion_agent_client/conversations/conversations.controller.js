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
exports.ConversationController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const conversations_service_1 = require("./conversations.service");
const conversation_dto_1 = require("./dto/conversation.dto");
let ConversationController = class ConversationController {
    constructor(conversationService) {
        this.conversationService = conversationService;
    }
    async findAll(userId, assistantId, etablissementId) {
        if (userId) {
            return this.conversationService.findByUser(userId);
        }
        else if (assistantId) {
            return this.conversationService.findByAssistant(assistantId);
        }
        else if (etablissementId) {
            return this.conversationService.findByEtablissementSante(etablissementId);
        }
        else {
            return this.conversationService.findAll();
        }
    }
    async getActiveConversations() {
        return this.conversationService.getActiveConversations();
    }
    async findOne(id) {
        return this.conversationService.findOne(+id);
    }
    async getActiveConversationForUser(userId) {
        const conversation = await this.conversationService.getActiveConversationForUser(userId);
        if (conversation) {
            return conversation;
        }
        return this.conversationService.getOrCreateConversation(userId);
    }
    async getActiveConversationForEtablissement(etablissementId) {
        const conversation = await this.conversationService.getActiveConversationForEtablissement(+etablissementId);
        if (conversation) {
            return conversation;
        }
        return this.conversationService.getOrCreateConversation(undefined, +etablissementId);
    }
    async countByAssistant(assistantId) {
        const count = await this.conversationService.countByAssistant(+assistantId);
        return { count };
    }
    async create(createConversationDto) {
        return this.conversationService.create({
            ...createConversationDto,
        });
    }
    async update(id, updateConversationDto) {
        return this.conversationService.update(+id, updateConversationDto);
    }
    async archive(id) {
        return this.conversationService.archive(+id);
    }
};
exports.ConversationController = ConversationController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('assistantId')),
    __param(2, (0, common_1.Query)('etablissementId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getActiveConversations", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('active/user/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getActiveConversationForUser", null);
__decorate([
    (0, common_1.Get)('active/etablissement/:etablissementId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('etablissementId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "getActiveConversationForEtablissement", null);
__decorate([
    (0, common_1.Get)('count/assistant/:assistantId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('assistantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "countByAssistant", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [conversation_dto_1.CreateConversationDto]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, conversation_dto_1.UpdateConversationDto]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/archive'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConversationController.prototype, "archive", null);
exports.ConversationController = ConversationController = __decorate([
    (0, common_1.Controller)('conversations'),
    __metadata("design:paramtypes", [conversations_service_1.ConversationService])
], ConversationController);
//# sourceMappingURL=conversations.controller.js.map