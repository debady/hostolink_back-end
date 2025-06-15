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
exports.InvitationController = void 0;
const common_1 = require("@nestjs/common");
const invitation_service_1 = require("./invitation.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const partage_invitation_dto_1 = require("./dto/partage-invitation.dto");
let InvitationController = class InvitationController {
    constructor(invitationService) {
        this.invitationService = invitationService;
    }
    async getOrCreateInvitation(request) {
        const user = request.user;
        const result = await this.invitationService.getOrCreateInvitation(user.id_user);
        return {
            success: true,
            code_invitation: result.code,
            lien_invitation: result.lien,
        };
    }
    async enregistrerClicInvitation(code, req) {
        if (!code) {
            throw new common_1.NotFoundException('Code d\'invitation manquant dans la requête');
        }
        const ip = req.ip || req.headers['x-forwarded-for'] || 'IP inconnue';
        const userAgent = req.headers['user-agent'] || 'Navigateur inconnu';
        await this.invitationService.enregistrerClic(code, ip.toString(), userAgent);
        return { success: true, message: 'Clic enregistré avec succès' };
    }
    async incrementerPartage(dto) {
        return await this.invitationService.incrementerNombrePartages(dto.code_invitation);
    }
};
exports.InvitationController = InvitationController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('code'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvitationController.prototype, "getOrCreateInvitation", null);
__decorate([
    (0, common_1.Get)('tracking'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitationController.prototype, "enregistrerClicInvitation", null);
__decorate([
    (0, common_1.Post)('partager'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [partage_invitation_dto_1.PartageInvitationDto]),
    __metadata("design:returntype", Promise)
], InvitationController.prototype, "incrementerPartage", null);
exports.InvitationController = InvitationController = __decorate([
    (0, common_1.Controller)('invitation'),
    __metadata("design:paramtypes", [invitation_service_1.InvitationService])
], InvitationController);
//# sourceMappingURL=invitation.controller.js.map