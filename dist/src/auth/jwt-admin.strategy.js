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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAdminStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const administrateur_service_1 = require("../administrateur/administrateur.service");
let JwtAdminStrategy = class JwtAdminStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-admin') {
    constructor(adminService, configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET') || 'defaultSecret',
            ignoreExpiration: false,
        });
        this.adminService = adminService;
        this.configService = configService;
    }
    async validate(payload) {
        if (!payload.id) {
            throw new common_1.UnauthorizedException('Token invalide');
        }
        const admin = await this.adminService.getAdminById(payload.id);
        if (!admin) {
            throw new common_1.UnauthorizedException('Accès refusé');
        }
        return admin;
    }
};
exports.JwtAdminStrategy = JwtAdminStrategy;
exports.JwtAdminStrategy = JwtAdminStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [administrateur_service_1.AdministrateurService,
        config_1.ConfigService])
], JwtAdminStrategy);
//# sourceMappingURL=jwt-admin.strategy.js.map