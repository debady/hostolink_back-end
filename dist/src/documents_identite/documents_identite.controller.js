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
exports.DocumentsIdentiteController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const documents_identite_service_1 = require("./documents_identite.service");
const create_documents_identite_dto_1 = require("./dto/create-documents-identite.dto");
const platform_express_1 = require("@nestjs/platform-express");
let DocumentsIdentiteController = class DocumentsIdentiteController {
    constructor(documentsIdentiteService) {
        this.documentsIdentiteService = documentsIdentiteService;
    }
    async createDocument(req, files, createDto) {
        if (!files || (!files.recto && !files.photo_profile)) {
            throw new common_1.BadRequestException('Aucun fichier téléchargé.');
        }
        const recto = files.recto ? files.recto[0] : undefined;
        const verso = files.verso ? files.verso[0] : undefined;
        const photo_profile = files.photo_profile ? files.photo_profile[0] : undefined;
        if (!recto || !photo_profile) {
            throw new common_1.BadRequestException('Les fichiers recto et photo de profil sont obligatoires.');
        }
        return this.documentsIdentiteService.createDocument(req.user.id_user, createDto, {
            recto,
            verso,
            photo_profile,
        });
    }
};
exports.DocumentsIdentiteController = DocumentsIdentiteController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'recto', maxCount: 1 },
        { name: 'verso', maxCount: 1 },
        { name: 'photo_profile', maxCount: 1 },
    ])),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_documents_identite_dto_1.CreateDocumentsIdentiteDto]),
    __metadata("design:returntype", Promise)
], DocumentsIdentiteController.prototype, "createDocument", null);
exports.DocumentsIdentiteController = DocumentsIdentiteController = __decorate([
    (0, common_1.Controller)('documents-identite'),
    __metadata("design:paramtypes", [documents_identite_service_1.DocumentsIdentiteService])
], DocumentsIdentiteController);
//# sourceMappingURL=documents_identite.controller.js.map