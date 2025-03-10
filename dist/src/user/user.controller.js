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
const user_service_1 = require("./user.service");
const check_user_dto_1 = require("./dto/check-user.dto");
const register_user_dto_1 = require("./dto/register-user.dto");
const otp_service_1 = require("../otp/otp.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let UserController = class UserController {
    constructor(userService, otpService) {
        this.userService = userService;
        this.otpService = otpService;
    }
    async checkUser(checkUserDto) {
        if (!checkUserDto.identifier?.trim()) {
            throw new common_1.BadRequestException('L’identifiant est requis');
        }
        const exists = await this.userService.checkUserExistence(checkUserDto.identifier.trim());
        return { success: true, exists, identifier: checkUserDto.identifier.trim() };
    }
    async registerUser(checkUserDto) {
        if (!checkUserDto.identifier?.trim()) {
            throw new common_1.BadRequestException('L’identifiant est requis');
        }
        try {
            return await this.userService.registerUser(checkUserDto.identifier.trim());
        }
        catch (error) {
            console.error('❌ Erreur register-user:', error);
            throw new common_1.InternalServerErrorException(error.message || "Erreur lors de l'inscription");
        }
    }
    async definePassword(registerUserDto) {
        if (!registerUserDto.identifier?.trim() || !registerUserDto.password?.trim()) {
            throw new common_1.BadRequestException('Identifiant et mot de passe sont obligatoires');
        }
        try {
            const success = await this.userService.setUserPassword(registerUserDto.identifier.trim(), registerUserDto.password.trim());
            if (!success) {
                throw new common_1.InternalServerErrorException("Échec de la mise à jour du mot de passe.");
            }
            return { success: true, message: 'Mot de passe défini avec succès' };
        }
        catch (error) {
            console.error("❌ Erreur define-password:", error);
            throw new common_1.InternalServerErrorException(error.message || "Erreur lors de la mise à jour du mot de passe");
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
    async generateOtp(body) {
        if (!body.identifier?.trim()) {
            throw new common_1.BadRequestException("L'identifiant est requis");
        }
        try {
            await this.otpService.generateOtp(body.identifier.trim());
            return { success: true, message: "OTP généré avec succès" };
        }
        catch (error) {
            console.error("❌ Erreur generate-otp:", error);
            throw new common_1.InternalServerErrorException(error.message || "Erreur lors de la génération de l'OTP");
        }
    }
    async verifyOtp(body) {
        if (!body.identifier?.trim() || !body.otpCode?.trim()) {
            throw new common_1.BadRequestException("Identifiant et code OTP requis");
        }
        try {
            return await this.otpService.verifyOtp(body.identifier.trim(), body.otpCode.trim());
        }
        catch (error) {
            console.error("❌ Erreur verify-otp:", error);
            throw new common_1.InternalServerErrorException(error.message || "Erreur lors de la vérification de l'OTP");
        }
    }
    async getAllUsers() {
        return await this.userService.getAllUsers();
    }
    async getMe(req) {
        return this.userService.getUserById(req.user.id_user);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('check-user'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [check_user_dto_1.CheckUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkUser", null);
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
    (0, common_1.Post)('verify-pin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyPin", null);
__decorate([
    (0, common_1.Post)('generate-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "generateOtp", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('user/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        otp_service_1.OtpService])
], UserController);
//# sourceMappingURL=user.controller.js.map