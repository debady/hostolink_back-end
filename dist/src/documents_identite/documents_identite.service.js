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
exports.DocumentsIdentiteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const documents_identite_entity_1 = require("./entities/documents_identite.entity");
const cloudinary_config_1 = require("../../config/cloudinary.config");
let DocumentsIdentiteService = class DocumentsIdentiteService {
    constructor(documentsIdentiteRepository, cloudinaryService) {
        this.documentsIdentiteRepository = documentsIdentiteRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async createDocument(id_user, createDto, files) {
        const existingDoc = await this.documentsIdentiteRepository.findOne({
            where: { id_user, statut_validation: 'en_attente' },
        });
        if (existingDoc) {
            throw new common_1.ConflictException('Un document est déjà en attente de validation.');
        }
        const url_recto = files.recto ? await this.cloudinaryService.uploadImage(files.recto) : undefined;
        const url_verso = files.verso ? await this.cloudinaryService.uploadImage(files.verso) : undefined;
        const url_photo_profile = await this.cloudinaryService.uploadImage(files.photo_profile);
        if (!url_recto || !url_photo_profile) {
            throw new common_1.BadRequestException('Les images recto et photo de profil sont obligatoires.');
        }
        const document = this.documentsIdentiteRepository.create({
            id_user: id_user,
            type_document: createDto.type_document,
            url_recto: url_recto,
            url_verso: url_verso,
            url_photo_profile: url_photo_profile,
            statut_validation: 'en_attente',
        });
        return this.documentsIdentiteRepository.save(document);
    }
};
exports.DocumentsIdentiteService = DocumentsIdentiteService;
exports.DocumentsIdentiteService = DocumentsIdentiteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(documents_identite_entity_1.DocumentsIdentiteEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        cloudinary_config_1.CloudinaryService])
], DocumentsIdentiteService);
//# sourceMappingURL=documents_identite.service.js.map