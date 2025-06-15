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
var PublicationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationController = void 0;
const common_1 = require("@nestjs/common");
const publication_service_1 = require("./publication.service");
const multer_1 = require("@nestjs/platform-express/multer");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
let PublicationController = PublicationController_1 = class PublicationController {
    constructor(publicationService) {
        this.publicationService = publicationService;
        this.logger = new common_1.Logger(PublicationController_1.name);
    }
    async createPublication(image, body) {
        return this.publicationService.create(body, image);
    }
    async findAll() {
        return this.publicationService.findAll();
    }
    async findOne(id) {
        return this.publicationService.findOne(id);
    }
    async findByUser(id_user) {
        return this.publicationService.findByUser(id_user);
    }
    async findByEtablissement(id_etablissement) {
        return this.publicationService.findByEtablissement(id_etablissement);
    }
    async findByAdmin(id_admin) {
        return this.publicationService.findByAdmin(id_admin);
    }
    async findByExpert(id_expert) {
        return this.publicationService.findByExpert(id_expert);
    }
    async likePost(id) {
        return this.publicationService.likePost(id);
    }
    async dislikePost(id) {
        return this.publicationService.dislikePost(id);
    }
    async getLikesCount(id) {
        return this.publicationService.getLikesCount(id);
    }
};
exports.PublicationController = PublicationController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, multer_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "createPublication", null);
__decorate([
    (0, common_1.Get)('recupations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('user/:id_user'),
    __param(0, (0, common_1.Param)('id_user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('etablissement/:id_etablissement'),
    __param(0, (0, common_1.Param)('id_etablissement', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "findByEtablissement", null);
__decorate([
    (0, common_1.Get)('admin/:id_admin'),
    __param(0, (0, common_1.Param)('id_admin', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "findByAdmin", null);
__decorate([
    (0, common_1.Get)('expert/:id_expert'),
    __param(0, (0, common_1.Param)('id_expert', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "findByExpert", null);
__decorate([
    (0, common_1.Post)(':id/like'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "likePost", null);
__decorate([
    (0, common_1.Post)(':id/dislike'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "dislikePost", null);
__decorate([
    (0, common_1.Get)(':id/likes/count'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PublicationController.prototype, "getLikesCount", null);
exports.PublicationController = PublicationController = PublicationController_1 = __decorate([
    (0, common_1.Controller)('publication'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [publication_service_1.PublicationService])
], PublicationController);
//# sourceMappingURL=publication.controller.js.map