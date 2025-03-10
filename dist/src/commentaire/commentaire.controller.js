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
exports.CommentaireController = void 0;
const common_1 = require("@nestjs/common");
const commentaire_service_1 = require("./commentaire.service");
const create_commentaire_dto_1 = require("./dto/create-commentaire.dto");
let CommentaireController = class CommentaireController {
    constructor(commentaireService) {
        this.commentaireService = commentaireService;
    }
    create(id_publication, createCommentaireDto) {
        return this.commentaireService.create(id_publication, createCommentaireDto);
    }
    findByPublicationIdAndUserId(id_publication, id_user) {
        return this.commentaireService.findByPublicationIdAndUserId(id_publication, id_user);
    }
    findByPublicationId(id_publication) {
        return this.commentaireService.findByPublicationId(id_publication);
    }
};
exports.CommentaireController = CommentaireController;
__decorate([
    (0, common_1.Post)(':id_publication/commentaire'),
    __param(0, (0, common_1.Param)('id_publication', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_commentaire_dto_1.CreateCommentaireDto]),
    __metadata("design:returntype", Promise)
], CommentaireController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id_publication/commentaire/user/:id_user'),
    __param(0, (0, common_1.Param)('id_publication', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('id_user', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], CommentaireController.prototype, "findByPublicationIdAndUserId", null);
__decorate([
    (0, common_1.Get)(':id_publication/commentaire'),
    __param(0, (0, common_1.Param)('id_publication', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommentaireController.prototype, "findByPublicationId", null);
exports.CommentaireController = CommentaireController = __decorate([
    (0, common_1.Controller)('publication'),
    __metadata("design:paramtypes", [commentaire_service_1.CommentaireService])
], CommentaireController);
//# sourceMappingURL=commentaire.controller.js.map