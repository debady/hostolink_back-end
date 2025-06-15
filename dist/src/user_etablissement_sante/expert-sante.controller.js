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
exports.ExpertSanteController = void 0;
const common_1 = require("@nestjs/common");
const expert_sante_service_1 = require("./expert-sante.service");
const jwt_etablissement_guard_1 = require("../auth/jwt-etablissement.guard");
const create_expert_dto_1 = require("./dto/create-expert.dto");
const jwt_expert_guard_1 = require("./guards/jwt-expert.guard");
const platform_express_1 = require("@nestjs/platform-express");
let ExpertSanteController = class ExpertSanteController {
    constructor(expertSanteService) {
        this.expertSanteService = expertSanteService;
    }
    async createExpert(dto, req) {
        const idEtab = req.user.id_user_etablissement_sante;
        return this.expertSanteService.creerExpert(dto, idEtab);
    }
    async loginExpert(body) {
        return this.expertSanteService.loginExpert(body.identifiant, body.mot_de_passe);
    }
    async getProfile(req) {
        return this.expertSanteService.getExpertById(req.user.id_expert);
    }
    async updatePassword(body) {
        return this.expertSanteService.updatePasswordExpert(body.identifiant, body.ancien_mdp, body.nouveau_mdp);
    }
    async getExpertsByEtablissement(req) {
        return this.expertSanteService.getExpertsByEtablissement(req.user.id_user_etablissement_sante);
    }
    async deleteExpert(id, req) {
        return this.expertSanteService.deleteExpertByEtablissement(id, req.user.id_user_etablissement_sante);
    }
    async updateAvatarExpert(file, req) {
        return this.expertSanteService.updateAvatar(file, req.user.id_expert);
    }
};
exports.ExpertSanteController = ExpertSanteController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_etablissement_guard_1.JwtEtablissementAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_expert_dto_1.CreateExpertSanteDto, Object]),
    __metadata("design:returntype", Promise)
], ExpertSanteController.prototype, "createExpert", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpertSanteController.prototype, "loginExpert", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_expert_guard_1.JwtExpertGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpertSanteController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('update-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpertSanteController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Get)('mes-experts'),
    (0, common_1.UseGuards)(jwt_etablissement_guard_1.JwtEtablissementAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpertSanteController.prototype, "getExpertsByEtablissement", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_etablissement_guard_1.JwtEtablissementAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ExpertSanteController.prototype, "deleteExpert", null);
__decorate([
    (0, common_1.Patch)('avatar'),
    (0, common_1.UseGuards)(jwt_expert_guard_1.JwtExpertGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExpertSanteController.prototype, "updateAvatarExpert", null);
exports.ExpertSanteController = ExpertSanteController = __decorate([
    (0, common_1.Controller)('expert-sante'),
    __metadata("design:paramtypes", [expert_sante_service_1.ExpertSanteService])
], ExpertSanteController);
//# sourceMappingURL=expert-sante.controller.js.map