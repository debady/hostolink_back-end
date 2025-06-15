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
exports.QrCodeJwtService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let QrCodeJwtService = class QrCodeJwtService {
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    generateToken(payload, isStatic) {
        const secret = isStatic
            ? this.configService.get('QR_STATIC_SECRET')
            : this.configService.get('QR_DYNAMIC_SECRET');
        const expiresIn = isStatic ? '365d' : '1d';
        return this.jwtService.sign(payload, {
            secret,
            expiresIn,
        });
    }
    verifyToken(token, isStatic = false) {
        try {
            const secret = isStatic
                ? this.configService.get('QR_STATIC_SECRET')
                : this.configService.get('QR_DYNAMIC_SECRET');
            return this.jwtService.verify(token, { secret });
        }
        catch (error) {
            throw new Error('Token invalide ou expiré');
        }
    }
};
exports.QrCodeJwtService = QrCodeJwtService;
exports.QrCodeJwtService = QrCodeJwtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], QrCodeJwtService);
//# sourceMappingURL=qr-code-jwt.service.js.map