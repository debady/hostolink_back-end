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
exports.QrDynamiqueController = void 0;
const common_1 = require("@nestjs/common");
const qr_dynamique_service_es_1 = require("./qr-dynamique.service_es");
const jwt_etablissement_guard_1 = require("../auth/jwt-etablissement.guard");
let QrDynamiqueController = class QrDynamiqueController {
    constructor(service) {
        this.service = service;
    }
    async getMyQr(req) {
        const id = req.user.id_user_etablissement_sante;
        return this.service.getQrActifOuNouveau(id);
    }
    async validateQr(token) {
        if (!token)
            throw new common_1.BadRequestException('Token requis');
        return this.service.validerQrEtInvalider(token);
    }
};
exports.QrDynamiqueController = QrDynamiqueController;
__decorate([
    (0, common_1.UseGuards)(jwt_etablissement_guard_1.JwtEtablissementAuthGuard),
    (0, common_1.Get)('my-dynamic-es'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QrDynamiqueController.prototype, "getMyQr", null);
__decorate([
    (0, common_1.Post)('validate-qr-es'),
    __param(0, (0, common_1.Body)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QrDynamiqueController.prototype, "validateQr", null);
exports.QrDynamiqueController = QrDynamiqueController = __decorate([
    (0, common_1.Controller)('qr-codes-es'),
    __metadata("design:paramtypes", [qr_dynamique_service_es_1.QrDynamiqueService])
], QrDynamiqueController);
//# sourceMappingURL=qr-dynamique.controller.js.map