"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../utilisateur/user.service");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = require("@nestjs/config");
const otp_entity_1 = require("../utilisateur/entities/otp.entity");
const user_etablissement_sante_entity_1 = require("../user_etablissement_sante/entities/user-etablissement-sante.entity");
const typeorm_decorators_1 = require("@nestjs/typeorm/dist/common/typeorm.decorators");
const typeorm_1 = require("typeorm");
let AuthService = class AuthService {
    constructor(userService, jwtService, configService, userRepo) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.userRepo = userRepo;
    }
    async generateJwtTokenFromUser(user) {
        const payload = {
            id_user: user.id_user,
            email: user.email,
            telephone: user.telephone,
        };
        return this.jwtService.sign(payload);
    }
    async validateUser(identifier, password) {
        const user = await this.userService.findUserByIdentifier(identifier);
        if (!user || !user.mdp) {
            console.warn(`❌ Utilisateur introuvable ou mot de passe non défini pour : ${identifier}`);
            throw new common_1.BadRequestException('Identifiant ou mot de passe incorrect');
        }
        const isMatch = await bcrypt.compare(password, user.mdp);
        if (!isMatch) {
            console.warn(`❌ Mot de passe incorrect pour l'utilisateur : ${identifier}`);
            throw new common_1.BadRequestException('Identifiant ou mot de passe incorrect');
        }
        if (!user.compte_verifier) {
            await this.userService.generateOtp(identifier, otp_entity_1.MoyenEnvoiEnum.SMS);
            return {
                user,
                access_token: null,
            };
        }
        const payload = { id_user: user.id_user, email: user.email };
        const access_token = this.jwtService.sign(payload);
        return {
            user,
            access_token,
        };
    }
    async sendOtpToUser(user) {
        await this.userService.generateAndSendOtp(user);
    }
    async validateUserEtablissementSante(identifiant, password) {
        const user = await this.userRepo.findOne({
            where: [
                { email: identifiant },
                { telephone: identifiant },
            ],
        });
        if (!user)
            return null;
        const isMatch = await bcrypt.compare(password, user.mot_de_passe);
        if (!isMatch)
            return null;
        const { mot_de_passe, ...rest } = user;
        return rest;
    }
    async login(user) {
        const payload = { id: user.id };
        return this.jwtService.sign(payload);
    }
    async loginEtablissement(user) {
        const payload = { id: user.id_user_etablissement_sante };
        return this.jwtService.sign(payload);
    }
    async register(identifier, code_invitation_utilise) {
        return this.userService.registerUser(identifier, code_invitation_utilise);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_decorators_1.InjectRepository)(user_etablissement_sante_entity_1.UserEtablissementSante)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService,
        typeorm_1.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map