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
exports.EtablissementSanteController = void 0;
const common_1 = require("@nestjs/common");
const etablissement_sante_service_1 = require("./etablissement_sante.service");
const etablissement_sante_dto_1 = require("./dto/etablissement_sante.dto");
const update_etablissement_dto_1 = require("./dto/update-etablissement.dto");
let EtablissementSanteController = class EtablissementSanteController {
    constructor(etablissementSanteService) {
        this.etablissementSanteService = etablissementSanteService;
    }
    async create(data) {
        return this.etablissementSanteService.createEtablissement(data);
    }
    async findAll() {
        return this.etablissementSanteService.findAll();
    }
    async findNearby(query) {
        return this.etablissementSanteService.findNearby(query.lat, query.lng, query.distance);
    }
    async findNearbyByCategory(findNearbyDto, categorie) {
        if (!categorie) {
            throw new common_1.BadRequestException('La catégorie doit être spécifiée.');
        }
        return this.etablissementSanteService.findNearbyByCategory(findNearbyDto.lat, findNearbyDto.lng, findNearbyDto.distance, categorie);
    }
    async findByName(nom) {
        if (!nom) {
            throw new common_1.BadRequestException('Le nom de l’établissement doit être spécifié.');
        }
        return this.etablissementSanteService.findByName(nom);
    }
    async update(id, updateData) {
        return this.etablissementSanteService.updateEtablissement(id, updateData);
    }
    async remove(id) {
        await this.etablissementSanteService.deleteEtablissement(id);
        return { message: `Établissement avec l'ID ${id} supprimé avec succès.` };
    }
    async findOne(id) {
        return this.etablissementSanteService.findOne(id);
    }
};
exports.EtablissementSanteController = EtablissementSanteController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EtablissementSanteController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EtablissementSanteController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('proches'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [etablissement_sante_dto_1.FindNearbyDto]),
    __metadata("design:returntype", Promise)
], EtablissementSanteController.prototype, "findNearby", null);
__decorate([
    (0, common_1.Get)('proches/categorie'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('categorie')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [etablissement_sante_dto_1.FindNearbyDto, String]),
    __metadata("design:returntype", Promise)
], EtablissementSanteController.prototype, "findNearbyByCategory", null);
__decorate([
    (0, common_1.Get)('recherche'),
    __param(0, (0, common_1.Query)('nom')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EtablissementSanteController.prototype, "findByName", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_etablissement_dto_1.UpdateEtablissementDto]),
    __metadata("design:returntype", Promise)
], EtablissementSanteController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EtablissementSanteController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EtablissementSanteController.prototype, "findOne", null);
exports.EtablissementSanteController = EtablissementSanteController = __decorate([
    (0, common_1.Controller)('etablissements'),
    __metadata("design:paramtypes", [etablissement_sante_service_1.EtablissementSanteService])
], EtablissementSanteController);
//# sourceMappingURL=etablissement_sante.controller.js.map