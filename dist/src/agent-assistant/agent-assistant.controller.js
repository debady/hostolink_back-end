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
exports.AgentAssistanceController = void 0;
const common_1 = require("@nestjs/common");
const agent_assistant_service_1 = require("./agent-assistant.service");
const jwt_agent_guard_1 = require("../auth/jwt-agent.guard");
const agent_dto_1 = require("./dto/agent.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const login_agent_dto_1 = require("./dto/login-agent.dto");
let AgentAssistanceController = class AgentAssistanceController {
    constructor(agentService) {
        this.agentService = agentService;
    }
    async login(loginDto) {
        const agent = await this.agentService.validateAgent(loginDto.email, loginDto.password);
        if (!agent) {
            throw new common_1.UnauthorizedException('Identifiants de connexion incorrects');
        }
        return this.agentService.login(agent);
    }
    getProfile(req) {
        return req.user;
    }
    createAgent(createAgentDto, req) {
        if (!createAgentDto.idAdminGestionnaire && req.user && req.user.id) {
            createAgentDto.idAdminGestionnaire = req.user.id;
        }
        return this.agentService.createAgent(createAgentDto);
    }
    deactivateAgent(id) {
        return this.agentService.deactivateAgent(+id);
    }
    activateAgent(id) {
        return this.agentService.activateAgent(+id);
    }
    findAll() {
        return this.agentService.findAll();
    }
    findActive() {
        return this.agentService.findActive();
    }
    findOne(id) {
        return this.agentService.getAgentById(+id);
    }
};
exports.AgentAssistanceController = AgentAssistanceController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_agent_dto_1.LoginAgentDto]),
    __metadata("design:returntype", Promise)
], AgentAssistanceController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_agent_guard_1.JwtAgentAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AgentAssistanceController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [agent_dto_1.CreateAgentDto, Object]),
    __metadata("design:returntype", void 0)
], AgentAssistanceController.prototype, "createAgent", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentAssistanceController.prototype, "deactivateAgent", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentAssistanceController.prototype, "activateAgent", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_agent_guard_1.JwtAgentAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AgentAssistanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AgentAssistanceController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_agent_guard_1.JwtAgentAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AgentAssistanceController.prototype, "findOne", null);
exports.AgentAssistanceController = AgentAssistanceController = __decorate([
    (0, common_1.Controller)('agent-assistant'),
    __metadata("design:paramtypes", [agent_assistant_service_1.AgentAssistanceService])
], AgentAssistanceController);
//# sourceMappingURL=agent-assistant.controller.js.map