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
exports.ListeNumeroEtablissementSanteController = void 0;
const common_1 = require("@nestjs/common");
const liste_numero_etablissement_sante_service_1 = require("./liste_numero_etablissement_sante.service");
const create_liste_numero_vert_etablissement_sante_dto_1 = require("./dto/create-liste-numero-vert-etablissement-sante.dto");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("../upload/cloudinary.service");
const update_liste_numero_vert_etablissement_sante_dto_1 = require("./dto/update-liste-numero-vert-etablissement-sante.dto");
let ListeNumeroEtablissementSanteController = class ListeNumeroEtablissementSanteController {
    constructor(listeService, cloudinaryService) {
        this.listeService = listeService;
        this.cloudinaryService = cloudinaryService;
    }
    async create(file, dto) {
        return await this.listeService.create(dto, file);
    }
    async findAll() {
        return this.listeService.findAll();
    }
    async findByCategory(categorie) {
        return this.listeService.findByCategory(categorie);
    }
    async findOne(id) {
        return this.listeService.findOne(id);
    }
    async update(id, file, dto) {
        return this.listeService.update(id, dto, file);
    }
    async remove(id) {
        return this.listeService.remove(id);
    }
};
exports.ListeNumeroEtablissementSanteController = ListeNumeroEtablissementSanteController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_liste_numero_vert_etablissement_sante_dto_1.CreateListeNumeroVertEtablissementSanteDto]),
    __metadata("design:returntype", Promise)
], ListeNumeroEtablissementSanteController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ListeNumeroEtablissementSanteController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('categorie'),
    __param(0, (0, common_1.Query)('categorie')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ListeNumeroEtablissementSanteController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListeNumeroEtablissementSanteController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, update_liste_numero_vert_etablissement_sante_dto_1.UpdateListeNumeroVertEtablissementSanteDto]),
    __metadata("design:returntype", Promise)
], ListeNumeroEtablissementSanteController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ListeNumeroEtablissementSanteController.prototype, "remove", null);
exports.ListeNumeroEtablissementSanteController = ListeNumeroEtablissementSanteController = __decorate([
    (0, common_1.Controller)('liste-numero-vert'),
    __metadata("design:paramtypes", [liste_numero_etablissement_sante_service_1.ListeNumeroEtablissementSanteService,
        cloudinary_service_1.CloudinaryService])
], ListeNumeroEtablissementSanteController);
//# sourceMappingURL=liste_numero_etablissement_sante.controller.js.map