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
exports.AnnonceController = void 0;
const common_1 = require("@nestjs/common");
const annonce_service_1 = require("./annonce.service");
const create_annonce_dto_1 = require("./dto/create-annonce.dto");
const update_annoce_dto_1 = require("./dto/update-annoce.dto");
const multer_1 = require("@nestjs/platform-express/multer");
const cloudinary_service_1 = require("./image/cloudinary.service");
let AnnonceController = class AnnonceController {
    constructor(annonceService, cloudinaryService) {
        this.annonceService = annonceService;
        this.cloudinaryService = cloudinaryService;
    }
    async createAnnonce(dto) {
        return this.annonceService.createAnnonce(dto);
    }
    async uploadImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('Aucune image envoyée');
        }
        const secureUrl = await this.cloudinaryService.uploadImage(file.buffer, `annonce_${Date.now()}`, 'hostolink/annonce_hostolink');
        return { secureUrl };
    }
    async getAllAnnonces() {
        return this.annonceService.getAllAnnonces();
    }
    async updateAnnonce(id, dto) {
        return this.annonceService.updateAnnonce(id, dto);
    }
    async deleteAnnonce(id) {
        return this.annonceService.deleteAnnonce(id);
    }
};
exports.AnnonceController = AnnonceController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_annonce_dto_1.CreateAnnonceDto]),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "createAnnonce", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, multer_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "getAllAnnonces", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_annoce_dto_1.UpdateAnnonceDto]),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "updateAnnonce", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AnnonceController.prototype, "deleteAnnonce", null);
exports.AnnonceController = AnnonceController = __decorate([
    (0, common_1.Controller)('annonces'),
    __metadata("design:paramtypes", [annonce_service_1.AnnonceService,
        cloudinary_service_1.CloudinaryService])
], AnnonceController);
//# sourceMappingURL=annonce.controller.js.map