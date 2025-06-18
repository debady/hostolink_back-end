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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const user_service_1 = require("../utilisateur/user.service");
const login_etablissement_dto_1 = require("../user_etablissement_sante/dto/login-etablissement.dto");
const create_user_dto_1 = require("../utilisateur/dto/create-user.dto");
let AuthController = class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    async login(body) {
        if (!body.identifier?.trim() || !body.password?.trim()) {
            console.warn(`❌ Identifiant ou mot de passe manquant : ${body.identifier}`);
            throw new common_1.BadRequestException('Identifiant et mot de passe requis');
        }
        try {
            const result = await this.authService.validateUser(body.identifier.trim(), body.password.trim());
            if (!result) {
                throw new common_1.BadRequestException('Identifiant ou mot de passe incorrect');
            }
            if (!result.access_token) {
                await this.authService.sendOtpToUser(result.user);
                return {
                    success: true,
                    message: 'Un OTP vous a été envoyé. Veuillez valider pour finaliser la connexion.',
                    compte_verifier: false,
                };
            }
            return {
                success: true,
                message: 'Connexion réussie',
                token: result.access_token,
                compte_verifier: true,
            };
        }
        catch (error) {
            console.error(`❌ Erreur lors de la connexion pour ${body.identifier}:`, error);
            throw new common_1.InternalServerErrorException('Erreur lors de la connexion Veuillez Confirmez votre compte ou réessayer plus tard');
        }
    }
    async loginEtablissement(dto) {
        const user = await this.authService.validateUserEtablissementSante(dto.identifiant, dto.mot_de_passe);
        if (!user)
            throw new common_1.UnauthorizedException('Identifiants invalides');
        const token = await this.authService.loginEtablissement(user);
        return {
            token,
            etablissement: user,
        };
    }
    async register(registerDto) {
        const identifier = registerDto.email ?? registerDto.telephone;
        return this.authService.register(identifier, registerDto.code_invitation_utilise);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/login-etablissement'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_etablissement_dto_1.LoginEtablissementDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginEtablissement", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map