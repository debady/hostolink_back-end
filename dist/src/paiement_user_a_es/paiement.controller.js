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
exports.PaiementController = void 0;
const common_1 = require("@nestjs/common");
const paiement_service_1 = require("./paiement.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PaiementController = class PaiementController {
    constructor(paiementService) {
        this.paiementService = paiementService;
    }
    async lireInfosParQr(token) {
        return this.paiementService.lireInfosParQr(token);
    }
    async payerParQr(req, body) {
        const idUser = req.user.id_user ?? req.user.idUser ?? req.user.id;
        return this.paiementService.payerParQr(body.shortId, body.idCompteEtablissement, body.montant, idUser);
    }
    async payerVersEtablissementParIdentifiant(body, req) {
        return this.paiementService.payerParIdentifiant(body.identifiant, body.montant, req.user.id_user);
    }
    getTokenTest(req) {
        return {
            message: "Token valide",
            utilisateur: req.user,
        };
    }
};
exports.PaiementController = PaiementController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('infos-qr'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaiementController.prototype, "lireInfosParQr", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('vers-etablissement'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaiementController.prototype, "payerParQr", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('vers-etablissement/email-ou-tel'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaiementController.prototype, "payerVersEtablissementParIdentifiant", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('test-token'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaiementController.prototype, "getTokenTest", null);
exports.PaiementController = PaiementController = __decorate([
    (0, common_1.Controller)('paiement'),
    __metadata("design:paramtypes", [paiement_service_1.PaiementService])
], PaiementController);
//# sourceMappingURL=paiement.controller.js.map