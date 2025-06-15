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
exports.GestUtilisateurController = void 0;
const common_1 = require("@nestjs/common");
const gest_utilisateur_service_1 = require("./gest_utilisateur.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const activation_user_dto_1 = require("./dto/activation-user.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const check_user_dto_1 = require("../../utilisateur/dto/check-user.dto");
let GestUtilisateurController = class GestUtilisateurController {
    constructor(gestUtilisateurService) {
        this.gestUtilisateurService = gestUtilisateurService;
    }
    async checkUser(checkUserDto) {
        if (!checkUserDto.identifier?.trim()) {
            throw new common_1.BadRequestException('L’identifiant est requis');
        }
        const exists = await this.gestUtilisateurService.checkUserExistence(checkUserDto.identifier.trim());
        return { success: true, exists, identifier: checkUserDto.identifier.trim() };
    }
    findAll() {
        return this.gestUtilisateurService.findAll();
    }
    findOne(id) {
        return this.gestUtilisateurService.findOne(id);
    }
    updateBanReason(id, updateUserDto) {
        return this.gestUtilisateurService.updateBanReason(id, updateUserDto);
    }
    remove(id) {
        return this.gestUtilisateurService.remove(id);
    }
    async updateActivation(id, activationUserDto) {
        return this.gestUtilisateurService.updateActivation(id, activationUserDto);
    }
    async resetPassword(id, resetPasswordDto) {
        return this.gestUtilisateurService.resetPassword(id, resetPasswordDto);
    }
};
exports.GestUtilisateurController = GestUtilisateurController;
__decorate([
    (0, common_1.Post)('check-user'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_user_dto_1.CheckUserDto]),
    __metadata("design:returntype", Promise)
], GestUtilisateurController.prototype, "checkUser", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GestUtilisateurController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GestUtilisateurController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/ban'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], GestUtilisateurController.prototype, "updateBanReason", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GestUtilisateurController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/activation'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, activation_user_dto_1.ActivationUserDto]),
    __metadata("design:returntype", Promise)
], GestUtilisateurController.prototype, "updateActivation", null);
__decorate([
    (0, common_1.Patch)(':id/reset-password'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], GestUtilisateurController.prototype, "resetPassword", null);
exports.GestUtilisateurController = GestUtilisateurController = __decorate([
    (0, common_1.Controller)('/admin/utilisateurs'),
    __metadata("design:paramtypes", [gest_utilisateur_service_1.GestUtilisateurService])
], GestUtilisateurController);
//# sourceMappingURL=gest_utilisateur.controller.js.map