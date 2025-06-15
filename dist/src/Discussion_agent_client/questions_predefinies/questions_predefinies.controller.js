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
exports.QuestionController = void 0;
const common_1 = require("@nestjs/common");
const questions_predefinies_service_1 = require("./questions_predefinies.service");
const question_dto_1 = require("./dto/question.dto");
const jwt_agent_guard_1 = require("../../auth/jwt-agent.guard");
let QuestionController = class QuestionController {
    constructor(questionService) {
        this.questionService = questionService;
    }
    async findAll(assistantId, category, Agent) {
        if (Agent) {
            return this.questionService.findAllAgent();
        }
        else if (assistantId && category) {
            return this.questionService.findByAssistantAndCategory(assistantId, category);
        }
        else if (assistantId) {
            return this.questionService.findByAssistant(assistantId);
        }
        else if (category) {
            return this.questionService.findByCategory(category);
        }
        else {
            return this.questionService.findAll();
        }
    }
    async findOne(id) {
        return this.questionService.findOne(+id);
    }
    async create(createQuestionDto) {
        return this.questionService.create(createQuestionDto);
    }
    async update(id, updateQuestionDto) {
        return this.questionService.update(+id, updateQuestionDto);
    }
    async remove(id) {
        await this.questionService.remove(+id);
        return { message: 'Question supprimée avec succès' };
    }
    async toggleActive(id) {
        return this.questionService.toggleActive(+id);
    }
};
exports.QuestionController = QuestionController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_agent_guard_1.JwtAgentAuthGuard),
    __param(0, (0, common_1.Query)('assistantId')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('Agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Boolean]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_agent_guard_1.JwtAgentAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [question_dto_1.CreateQuestionDto]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/modifier-question'),
    (0, common_1.UseGuards)(jwt_agent_guard_1.JwtAgentAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, question_dto_1.UpdateQuestionDto]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id/supprimer'),
    (0, common_1.UseGuards)(jwt_agent_guard_1.JwtAgentAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    (0, common_1.UseGuards)(jwt_agent_guard_1.JwtAgentAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "toggleActive", null);
exports.QuestionController = QuestionController = __decorate([
    (0, common_1.Controller)('questions'),
    (0, common_1.UseGuards)(jwt_agent_guard_1.JwtAgentAuthGuard),
    __metadata("design:paramtypes", [questions_predefinies_service_1.QuestionService])
], QuestionController);
//# sourceMappingURL=questions_predefinies.controller.js.map