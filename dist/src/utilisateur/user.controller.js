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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const user_service_1 = require("./user.service");
const check_user_dto_1 = require("./dto/check-user.dto");
const register_user_dto_1 = require("./dto/register-user.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const otp_entity_1 = require("./entities/otp.entity");
const auth_service_1 = require("../auth/auth.service");
let UserController = class UserController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async registerUser(checkUserDto) {
        try {
            const result = await this.userService.registerUser(checkUserDto.identifier.trim(), checkUserDto.code_invitation_utilise?.trim());
            return { success: result.success, id_user: result.id_user, message: result.message };
        }
        catch (error) {
            console.error('❌ Erreur register-user:', error);
            throw new common_1.InternalServerErrorException(error.message || "Erreur lors de l'inscription");
        }
    }
    async definePassword(registerUserDto) {
        let identifier = registerUserDto.identifier?.trim();
        const password = registerUserDto.password?.trim();
        if (!identifier || !password) {
            throw new common_1.BadRequestException('Identifiant et mot de passe sont obligatoires');
        }
        if (!identifier.includes('@') && !identifier.startsWith('+')) {
            identifier = '+225' + identifier.replace(/^0/, '');
            console.log(`📱 Numéro formaté: ${identifier}`);
        }
        try {
            const success = await this.userService.setUserPassword(identifier, password);
            if (!success) {
                throw new common_1.InternalServerErrorException("Échec de la mise à jour du mot de passe.");
            }
            const moyen = identifier.includes('@') ? otp_entity_1.MoyenEnvoiEnum.EMAIL : otp_entity_1.MoyenEnvoiEnum.SMS;
            console.log(`🔍 Envoi OTP via ${moyen} à ${identifier}`);
            const { otp } = await this.userService.generateOtp(identifier, moyen);
            return {
                success: true,
                message: `Mot de passe défini. Un OTP a été envoyé via ${moyen}.`,
                debug: moyen === otp_entity_1.MoyenEnvoiEnum.SMS ? otp : undefined,
            };
        }
        catch (error) {
            console.error("❌ Erreur define-password:", error);
            throw new common_1.InternalServerErrorException(error.message || "Erreur lors de la mise à jour du mot de passe");
        }
    }
    async generateOtp(body) {
        if (!body.identifier?.trim()) {
            throw new common_1.BadRequestException("L'identifiant est requis");
        }
        try {
            const moyenEnvoyerFormatted = body.moyen_envoyer.toLowerCase();
            console.log(`📩 Génération OTP pour ${body.identifier} via ${moyenEnvoyerFormatted}`);
            const { otp } = await this.userService.generateOtp(body.identifier.trim(), moyenEnvoyerFormatted);
            if (moyenEnvoyerFormatted === otp_entity_1.MoyenEnvoiEnum.SMS || moyenEnvoyerFormatted === otp_entity_1.MoyenEnvoiEnum.TELEPHONE) {
                return {
                    success: true,
                    message: "OTP généré avec succès (affiché uniquement en mode SMS)",
                    moyen: moyenEnvoyerFormatted,
                    otp,
                };
            }
            else {
                return {
                    success: true,
                    message: "OTP envoyé par email avec succès",
                    moyen: moyenEnvoyerFormatted,
                    otp
                };
            }
        }
        catch (error) {
            console.error("❌ Erreur generate-otp:", error);
            throw new common_1.InternalServerErrorException(error.message || "Erreur lors de la génération de l'OTP");
        }
    }
    async verifyPin(body) {
        if (!body.identifier?.trim() || !body.pin?.trim()) {
            throw new common_1.BadRequestException('Identifiant et PIN requis');
        }
        try {
            const isValid = await this.userService.verifyUserPin(body.identifier.trim(), body.pin.trim());
            return isValid
                ? { success: true, message: 'PIN valide' }
                : { success: false, message: 'PIN incorrect' };
        }
        catch (error) {
            console.error("❌ Erreur verify-pin:", error);
            throw new common_1.InternalServerErrorException("Erreur lors de la vérification du PIN");
        }
    }
    async verifyOtp(body) {
        if (!body.identifier?.trim() || !body.otpCode?.trim()) {
            throw new common_1.BadRequestException("Identifiant et code OTP requis");
        }
        try {
            const identifier = body.identifier.trim();
            const otpCode = body.otpCode.trim();
            console.log(`📩 Vérification OTP pour ${identifier}`);
            const result = await this.userService.verifyOtp(identifier, otpCode);
            if (!result.success)
                return result;
            const user = await this.userService.findUserByIdentifier(identifier);
            if (!user)
                throw new common_1.NotFoundException("Utilisateur introuvable.");
            const token = await this.authService.generateJwtTokenFromUser(user);
            return {
                success: true,
                message: result.message,
                token,
            };
        }
        catch (error) {
            console.error("❌ Erreur verify-otp:", error);
            return { success: false, message: "Échec de la vérification de l'OTP" };
        }
    }
    async getMe(req) {
        const user = await this.userService.getUserById(req.user.id_user);
        return {
            success: true,
            data: user,
        };
    }
    async updateProfile(req, updateProfileDto, file) {
        const id_user = req.user.id_user;
        console.log('🟢 Image reçue:', file ? file.originalname : 'Aucune image reçue');
        console.log('🔵 id_user extrait du token:', id_user);
        return await this.userService.updateUserProfile(id_user, updateProfileDto, file);
    }
    async getAllEmails(req) {
        return await this.userService.getAllEmails();
    }
    async getAllTelephones(req) {
        return await this.userService.getAllTelephones();
    }
    async checkIdentifier(req, body) {
        if (!body.identifier?.trim()) {
            throw new common_1.BadRequestException("Identifiant requis.");
        }
        const user = await this.userService.findUserByIdentifier(body.identifier.trim());
        if (user) {
            return { success: true, message: "Identifiant trouvé", data: user };
        }
        else {
            return { success: false, message: "Identifiant non trouvé" };
        }
    }
    async updateFcmToken(req, fcm_token) {
        const userId = req.user.id_user;
        return this.userService.updateFcmToken(userId, fcm_token);
    }
    async createFullUser(body) {
        let parsedPosition = undefined;
        if (body.position) {
            try {
                parsedPosition = typeof body.position === 'string' ? JSON.parse(body.position) : undefined;
            }
            catch (e) {
                throw new common_1.BadRequestException('Position doit être un objet JSON valide avec longitude et latitude.');
            }
        }
        return this.userService.createFullUser({
            ...body,
            position: parsedPosition,
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('register-user'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_user_dto_1.CheckUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)('define-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "definePassword", null);
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "generateOtp", null);
__decorate([
    (0, common_1.Post)('verify-pin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyPin", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Get)('user/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.Patch)('/update-profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('all-emails'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllEmails", null);
__decorate([
    (0, common_1.Get)('all-telephones'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllTelephones", null);
__decorate([
    (0, common_1.Post)('check-identifier'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkIdentifier", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('update-fcm-token'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('fcm_token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateFcmToken", null);
__decorate([
    (0, common_1.Post)('creer-compte-complet'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createFullUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], UserController);
//# sourceMappingURL=user.controller.js.map