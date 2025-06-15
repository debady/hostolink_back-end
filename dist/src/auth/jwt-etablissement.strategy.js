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
exports.JwtEtablissementStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_etablissement_sante_entity_1 = require("../user_etablissement_sante/entities/user-etablissement-sante.entity");
const user_etablissement_sante_service_1 = require("../user_etablissement_sante/user-etablissement-sante.service");
let JwtEtablissementStrategy = class JwtEtablissementStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-etablissement') {
    constructor(configService, userRepo, userEtablissementService) {
        const secret = configService.get('JWT_SECRET');
        if (!secret)
            throw new Error('JWT_SECRET est manquant');
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
            passReqToCallback: true,
        });
        this.configService = configService;
        this.userRepo = userRepo;
        this.userEtablissementService = userEtablissementService;
    }
    async validate(req, payload) {
        const token = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (!token)
            throw new common_1.UnauthorizedException('Token manquant');
        if (this.userEtablissementService.isTokenRevoked(token)) {
            throw new common_1.UnauthorizedException('Token révoqué');
        }
        const user = await this.userRepo.findOne({ where: { id_user_etablissement_sante: payload.id } });
        if (!user)
            return null;
        return user;
    }
};
exports.JwtEtablissementStrategy = JwtEtablissementStrategy;
exports.JwtEtablissementStrategy = JwtEtablissementStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_etablissement_sante_entity_1.UserEtablissementSante)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_etablissement_sante_service_1.UserEtablissementSanteService))),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        user_etablissement_sante_service_1.UserEtablissementSanteService])
], JwtEtablissementStrategy);
//# sourceMappingURL=jwt-etablissement.strategy.js.map