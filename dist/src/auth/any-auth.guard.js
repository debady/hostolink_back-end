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
exports.AnyAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const jwt_expert_guard_1 = require("../user_etablissement_sante/guards/jwt-expert.guard");
const jwt_etablissement_guard_1 = require("./jwt-etablissement.guard");
let AnyAuthGuard = class AnyAuthGuard {
    constructor(jwtAuthGuard, jwtEtablissementAuthGuard, jwtExpertGuard, jwtAdminGuard) {
        this.jwtAuthGuard = jwtAuthGuard;
        this.jwtEtablissementAuthGuard = jwtEtablissementAuthGuard;
        this.jwtExpertGuard = jwtExpertGuard;
        this.jwtAdminGuard = jwtAdminGuard;
    }
    async canActivate(context) {
        const guards = [
            this.jwtAuthGuard,
            this.jwtEtablissementAuthGuard,
            this.jwtExpertGuard,
            this.jwtAdminGuard,
        ];
        for (const guard of guards) {
            try {
                const result = await guard.canActivate(context);
                if (result) {
                    return true;
                }
            }
            catch (error) {
                continue;
            }
        }
        return false;
    }
};
exports.AnyAuthGuard = AnyAuthGuard;
exports.AnyAuthGuard = AnyAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_auth_guard_1.JwtAuthGuard,
        jwt_etablissement_guard_1.JwtEtablissementAuthGuard,
        jwt_expert_guard_1.JwtExpertGuard,
        jwt_auth_guard_1.JwtAdminGuard])
], AnyAuthGuard);
//# sourceMappingURL=any-auth.guard.js.map