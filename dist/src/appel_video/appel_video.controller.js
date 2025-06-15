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
exports.AppelVideoController = void 0;
const common_1 = require("@nestjs/common");
const appel_video_service_1 = require("./appel_video.service");
const create_appel_dto_1 = require("./dto/create-appel.dto");
const terminer_appel_dto_1 = require("./dto/terminer-appel.dto");
const update_appel_video_dto_1 = require("./dto/update-appel-video.dto");
const disponibilite_expert_dto_1 = require("./dto/disponibilite-expert.dto");
const refuse_appel_video_dto_1 = require("./dto/refuse-appel_video.dto");
let AppelVideoController = class AppelVideoController {
    constructor(appelService) {
        this.appelService = appelService;
    }
    async lancerAppel(dto) {
        return this.appelService.lancerAppel(dto);
    }
    async terminerAppel(id_appel, dto) {
        return this.appelService.terminerAppel(id_appel, dto);
    }
    async verifierAppelActif(id_user) {
        return this.appelService.verifierAppelActif(id_user.trim());
    }
    async historiqueAppels(id_user) {
        return this.appelService.historiqueAppels(id_user.trim());
    }
    async changerStatus(id_appel, dto) {
        return this.appelService.changerStatusAppel(id_appel.trim(), dto);
    }
    async annulerAppel(id_appel) {
        return this.appelService.annulerAppel(id_appel.trim());
    }
    async mettreAJourDispo(id_expert, dto) {
        return this.appelService.mettreAJourDisponibilite(id_expert, dto);
    }
    async listerExpertsConnectes() {
        return this.appelService.listerExpertsDisponibles();
    }
    async getAppelsEnAttente(id_expert) {
        return this.appelService.appelsEnAttentePourExpert(id_expert);
    }
    async accepterAppel(id_appel) {
        return this.appelService.accepterAppel(id_appel.trim());
    }
    async terminerParExpert(id_appel, dto) {
        return this.appelService.terminerAppelParExpert(id_appel.trim(), dto);
    }
    async getHistoriqueExpert(id_expert) {
        return this.appelService.historiqueAppelsExpert(id_expert);
    }
    async refuserAppel(id_appel, dto) {
        return this.appelService.refuserAppel(id_appel.trim(), dto);
    }
    async verifierAppelEnCours(id_expert) {
        return this.appelService.verifierAppelEnCoursPourExpert(id_expert);
    }
};
exports.AppelVideoController = AppelVideoController;
__decorate([
    (0, common_1.Post)('lancer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appel_dto_1.CreateAppelDto]),
    __metadata("design:returntype", Promise)
], AppelVideoController.prototype, "lancerAppel", null);
__decorate([
    (0, common_1.Post)('terminer/:id_appel'),
    __param(0, (0, common_1.Param)('id_appel')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, terminer_appel_dto_1.TerminerAppelDto]),
    __metadata("design:returntype", Promise)
], AppelVideoController.prototype, "terminerAppel", null);
__decorate([
    (0, common_1.Get)('actif/:id_user'),
    __param(0, (0, common_1.Param)('id_user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppelVideoController.prototype, "verifierAppelActif", null);
__decorate([
    (0, common_1.Get)('historique/:id_user'),
    __param(0, (0, common_1.Param)('id_user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppelVideoController.prototype, "historiqueAppels", null);
__decorate([
    (0, common_1.Patch)('status/:id_appel'),
    __param(0, (0, common_1.Param)('id_appel')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_appel_video_dto_1.UpdateAppelStatusDto]),
    __metadata("design:returntype", Promise)
], AppelVideoController.prototype, "changerStatus", null);
__decorate([
    (0, common_1.Delete)(':id_appel'),
    __param(0, (0, common_1.Param)('id_appel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppelVideoController.prototype, "annulerAppel", null);
__decorate([
    (0, common_1.Post)('disponibilite/:id_expert'),
    __param(0, (0, common_1.Param)('id_expert')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, disponibilite_expert_dto_1.MajDisponibiliteDto]),
    __metadata("design:returntype", Promise)
], AppelVideoController.prototype, "mettreAJourDispo", null);
__decorate([
    (0, common_1.Get)('disponibles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppelVideoController.prototype, "listerExpertsConnectes", null);
__decorate([
    (0, common_1.Get)('en-attente/:id_expert'),
    __param(0, (0, common_1.Param)('id_expert')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppelVideoController.prototype, "getAppelsEnAttente", null);
__decorate([
    (0, common_1.Post)('accepter/:id_appel'),
    __param(0, (0, common_1.Param)('id_appel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppelVideoController.prototype, "accepterAppel", null);
__decorate([
    (0, common_1.Post)('terminer-par-expert/:id_appel'),
    __param(0, (0, common_1.Param)('id_appel')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, terminer_appel_dto_1.TerminerAppelDto]),
    __metadata("design:returntype", Promise)
], AppelVideoController.prototype, "terminerParExpert", null);
__decorate([
    (0, common_1.Get)('historique-expert/:id_expert'),
    __param(0, (0, common_1.Param)('id_expert')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppelVideoController.prototype, "getHistoriqueExpert", null);
__decorate([
    (0, common_1.Patch)('refuser/:id_appel'),
    __param(0, (0, common_1.Param)('id_appel')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, refuse_appel_video_dto_1.RefusAppelDto]),
    __metadata("design:returntype", Promise)
], AppelVideoController.prototype, "refuserAppel", null);
__decorate([
    (0, common_1.Get)('en-cours/:id_expert'),
    __param(0, (0, common_1.Param)('id_expert')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AppelVideoController.prototype, "verifierAppelEnCours", null);
exports.AppelVideoController = AppelVideoController = __decorate([
    (0, common_1.Controller)('appel-video'),
    __metadata("design:paramtypes", [appel_video_service_1.AppelVideoService])
], AppelVideoController);
//# sourceMappingURL=appel_video.controller.js.map