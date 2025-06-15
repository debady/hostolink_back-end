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
exports.ThematiqueDiscussionController = void 0;
const common_1 = require("@nestjs/common");
const create_thematique_dto_1 = require("./dto/create-thematique.dto");
const create_message_dto_1 = require("./dto/create-message.dto");
const thematique_message_service_1 = require("./thematique_message.service");
const reponse_message_expert_dto_1 = require("./dto/reponse-message-expert.dto");
let ThematiqueDiscussionController = class ThematiqueDiscussionController {
    constructor(thematiqueService) {
        this.thematiqueService = thematiqueService;
    }
    async createThematique(dto) {
        return this.thematiqueService.createThematique(dto);
    }
    async getAllThematiques() {
        return this.thematiqueService.getAllThematiques();
    }
    async createMessage(dto) {
        return this.thematiqueService.createMessage(dto);
    }
    async getMessagesByThematique(id) {
        const messages = await this.thematiqueService.getMessagesByThematique(id);
        if (!messages || messages.length === 0) {
            throw new common_1.NotFoundException('Aucun message trouvé pour cette thématique.');
        }
        return messages;
    }
    async repondreEnTantQueExpert(dto) {
        return this.thematiqueService.repondreEnTantQueExpert(dto);
    }
    async markMessagesAsRead(id, id_user) {
        await this.thematiqueService.marquerMessagesCommeLus(id, id_user);
        return { success: true, message: 'Messages marqués comme lus' };
    }
};
exports.ThematiqueDiscussionController = ThematiqueDiscussionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_thematique_dto_1.CreateThematiqueDto]),
    __metadata("design:returntype", Promise)
], ThematiqueDiscussionController.prototype, "createThematique", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThematiqueDiscussionController.prototype, "getAllThematiques", null);
__decorate([
    (0, common_1.Post)('/messages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_message_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], ThematiqueDiscussionController.prototype, "createMessage", null);
__decorate([
    (0, common_1.Get)(':id/messages'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ThematiqueDiscussionController.prototype, "getMessagesByThematique", null);
__decorate([
    (0, common_1.Post)('/messages/repondre'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reponse_message_expert_dto_1.RepondreMessageExpertDto]),
    __metadata("design:returntype", Promise)
], ThematiqueDiscussionController.prototype, "repondreEnTantQueExpert", null);
__decorate([
    (0, common_1.Patch)(':id/mark-as-read'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('id_user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ThematiqueDiscussionController.prototype, "markMessagesAsRead", null);
exports.ThematiqueDiscussionController = ThematiqueDiscussionController = __decorate([
    (0, common_1.Controller)('thematiques'),
    __metadata("design:paramtypes", [thematique_message_service_1.ThematiqueDiscussionService])
], ThematiqueDiscussionController);
//# sourceMappingURL=thematique_discussion.controller.js.map