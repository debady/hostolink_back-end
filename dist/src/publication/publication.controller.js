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
exports.PublicationController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const publication_service_1 = require("./publication.service");
let PublicationController = class PublicationController {
    constructor(publicationService) {
        this.publicationService = publicationService;
    }
    async create(body, file) {
        const createPublicationDto = {
            titre_publication: String(body.titre_publication),
            contenu: String(body.contenu),
            id_user: parseInt(body.id_user, 10)
        };
        return this.publicationService.create(createPublicationDto, file);
    }
    findAll() {
        return this.publicationService.findAll();
    }
    findOne(id) {
        return this.publicationService.findOne(id);
    }
    findByUserId(userId) {
        return this.publicationService.findByUserId(userId);
    }
    async addComment(id_publication, body) {
        const createCommentaireDto = {
            contenu: String(body.contenu),
            id_user: parseInt(body.id_user, 10),
            id_publication: id_publication,
        };
        return this.publicationService.addComment(createCommentaireDto);
    }
    getCommentsByPublicationId(id_publication) {
        return this.publicationService.getCommentsByPublicationId(id_publication);
    }
    likePost(id) {
        return this.publicationService.likePost(id);
    }
    dislikePost(id) {
        return this.publicationService.dislikePost(id);
    }
    async deletePublication(id, body) {
        return this.publicationService.deletePublication(id, body.id_user);
    }
};
exports.PublicationController = PublicationController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Post)(':id_publication/commentaire'),
    __param(0, (0, common_1.Param)('id_publication', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "addComment", null);
__decorate([
    (0, common_1.Get)(':id_publication/commentaire'),
    __param(0, (0, common_1.Param)('id_publication', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "getCommentsByPublicationId", null);
__decorate([
    (0, common_1.Post)(':id/like'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "likePost", null);
__decorate([
    (0, common_1.Post)(':id/dislike'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "dislikePost", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "deletePublication", null);
exports.PublicationController = PublicationController = __decorate([
    (0, common_1.Controller)('publication'),
    __metadata("design:paramtypes", [publication_service_1.PublicationService])
], PublicationController);
//# sourceMappingURL=publication.controller.js.map