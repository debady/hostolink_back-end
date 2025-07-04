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
exports.UserEtablissementSanteController = void 0;
const common_1 = require("@nestjs/common");
const user_etablissement_sante_service_1 = require("./user-etablissement-sante.service");
const create_user_etablissement_dto_1 = require("./dto/create-user-etablissement.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const update_password_dto_1 = require("./dto/update-password.dto");
const delete_account_dto_1 = require("./dto/delete-account.dto");
const jwt_etablissement_guard_1 = require("../auth/jwt-etablissement.guard");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let UserEtablissementSanteController = class UserEtablissementSanteController {
    constructor(userEtablissementSanteService, service) {
        this.userEtablissementSanteService = userEtablissementSanteService;
        this.service = service;
    }
    register(dto) {
        return this.service.register(dto);
    }
    verify(body) {
        return this.service.verifyOtp(body.email, body.code);
    }
    async login(body) {
        return this.service.login(body.email, body.fcm_token);
    }
    async logout(req) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            throw new common_1.BadRequestException('Token manquant');
        return this.service.logout(token);
    }
    async getProfile(req) {
        const id = req.user.id_user_etablissement_sante;
        return this.service.getProfile(id);
    }
    updateProfile(req, dto) {
        const id = req.user.id_user_etablissement_sante;
        return this.service.updateProfile(id, dto);
    }
    async regenerateOtp(identifiant) {
        if (!identifiant)
            throw new common_1.ConflictException('Identifiant requis');
        return this.service.regenerateOtp(identifiant);
    }
    async changePassword(dto) {
        return this.service.changePasswordWithOtp(dto);
    }
    async deleteAccount(req, dto) {
        const id = req.user.id_user_etablissement_sante;
        return this.service.deleteAccountWithReason(id, dto);
    }
    async uploadAvatar(file, req) {
        const id = req.user?.id_user_etablissement_sante ??
            (await this.userEtablissementSanteService.findLastCreatedEtablissementId());
        if (!id)
            throw new common_1.BadRequestException('Impossible de déterminer l’établissement');
        return this.userEtablissementSanteService.uploadOrUpdateAvatar(id, file);
    }
    async uploadAvatarAuthenticated(file, req) {
        const id = req.user.id_user_etablissement_sante;
        if (!file)
            throw new common_1.BadRequestException('Aucun fichier envoyé');
        return this.userEtablissementSanteService.uploadOrUpdateAvatar(id, file);
    }
    async getAllEmailsForEs(req) {
        return await this.userEtablissementSanteService.getAllEmailsForEs();
    }
    async getAllTelephonesForEs(req) {
        return await this.userEtablissementSanteService.getAllTelephonesForEs();
    }
    async checkIdentifier(req, body) {
        if (!body.identifier?.trim()) {
            throw new common_1.BadRequestException("Identifiant requis.");
        }
        const user_etablissement_sante = await this.userEtablissementSanteService.findEtablissementByIdentifier(body.identifier.trim());
        if (user_etablissement_sante) {
            return { success: true, message: "Identifiant trouvé", data: user_etablissement_sante };
        }
        else {
            return { success: false, message: "Identifiant non trouvé" };
        }
    }
    async updateFcmToken(req, body) {
        const id = req.user.id_user_etablissement_sante;
        return this.service.updateFcmToken(id, body.fcm_token);
    }
};
exports.UserEtablissementSanteController = UserEtablissementSanteController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_etablissement_dto_1.CreateUserEtablissementDto]),
    __metadata("design:returntype", void 0)
], UserEtablissementSanteController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserEtablissementSanteController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserEtablissementSanteController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(jwt_etablissement_guard_1.JwtEtablissementAuthGuard),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserEtablissementSanteController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_etablissement_guard_1.JwtEtablissementAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserEtablissementSanteController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_etablissement_guard_1.JwtEtablissementAuthGuard),
    (0, common_1.Patch)('update-profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileEtablissementDto]),
    __metadata("design:returntype", void 0)
], UserEtablissementSanteController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('otp/re-generate'),
    __param(0, (0, common_1.Body)('identifiant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserEtablissementSanteController.prototype, "regenerateOtp", null);
__decorate([
    (0, common_1.Patch)('password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_password_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], UserEtablissementSanteController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_etablissement_guard_1.JwtEtablissementAuthGuard),
    (0, common_1.Delete)('delete-account'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, delete_account_dto_1.DeleteAccountDto]),
    __metadata("design:returntype", Promise)
], UserEtablissementSanteController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image_profil')),
    (0, common_1.Post)('avatar'),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserEtablissementSanteController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.UseGuards)(jwt_etablissement_guard_1.JwtEtablissementAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image_profil')),
    (0, common_1.Post)('upload-avatar'),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserEtablissementSanteController.prototype, "uploadAvatarAuthenticated", null);
__decorate([
    (0, common_1.Get)('all-etablissement-emails'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserEtablissementSanteController.prototype, "getAllEmailsForEs", null);
__decorate([
    (0, common_1.Get)('all-etablissement-telephones'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserEtablissementSanteController.prototype, "getAllTelephonesForEs", null);
__decorate([
    (0, common_1.Post)('check-etablissement-exist'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserEtablissementSanteController.prototype, "checkIdentifier", null);
__decorate([
    (0, common_1.UseGuards)(jwt_etablissement_guard_1.JwtEtablissementAuthGuard),
    (0, common_1.Patch)('update-fcm-token'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserEtablissementSanteController.prototype, "updateFcmToken", null);
exports.UserEtablissementSanteController = UserEtablissementSanteController = __decorate([
    (0, common_1.Controller)('user-etablissement-sante'),
    __metadata("design:paramtypes", [user_etablissement_sante_service_1.UserEtablissementSanteService,
        user_etablissement_sante_service_1.UserEtablissementSanteService])
], UserEtablissementSanteController);
//# sourceMappingURL=user-etablissement-sante.controller.js.map