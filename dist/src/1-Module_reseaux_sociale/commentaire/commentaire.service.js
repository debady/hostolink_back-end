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
var CommentaireService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentaireService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const commentaire_entity_1 = require("./entities/commentaire.entity");
let CommentaireService = CommentaireService_1 = class CommentaireService {
    constructor(commentaireRepository) {
        this.commentaireRepository = commentaireRepository;
        this.logger = new common_1.Logger(CommentaireService_1.name);
    }
    async create(id_publication, createCommentaireDto) {
        this.logger.log('💬 Création commentaire');
        this.validateSingleAuthor(createCommentaireDto);
        const commentaireData = {
            contenu: createCommentaireDto.contenu,
            publication: { id_publication },
        };
        if (createCommentaireDto.id_user) {
            commentaireData.id_user = createCommentaireDto.id_user;
        }
        if (createCommentaireDto.id_user_etablissement_sante) {
            commentaireData.id_user_etablissement_sante = createCommentaireDto.id_user_etablissement_sante;
        }
        if (createCommentaireDto.id_admin_gestionnaire) {
            commentaireData.id_admin_gestionnaire = createCommentaireDto.id_admin_gestionnaire;
        }
        if (createCommentaireDto.id_expert) {
            commentaireData.id_expert = createCommentaireDto.id_expert;
        }
        const commentaire = this.commentaireRepository.create(commentaireData);
        const savedCommentaire = await this.commentaireRepository.save(commentaire);
        this.logger.log(`✅ Commentaire créé avec ID: ${savedCommentaire.id_commentaire}`);
        return savedCommentaire;
    }
    validateSingleAuthor(dto) {
        const authorFields = [
            dto.id_user,
            dto.id_user_etablissement_sante,
            dto.id_admin_gestionnaire,
            dto.id_expert
        ].filter(field => field !== undefined && field !== null);
        if (authorFields.length === 0) {
            throw new common_1.BadRequestException('Au moins un ID d\'auteur doit être fourni (id_user, id_user_etablissement_sante, id_admin_gestionnaire, ou id_expert)');
        }
        if (authorFields.length > 1) {
            throw new common_1.BadRequestException('Un seul ID d\'auteur doit être fourni');
        }
    }
    async findByPublicationId(id_publication) {
        return this.commentaireRepository.find({
            where: { publication: { id_publication } },
            order: { date_commentaire: 'DESC' }
        });
    }
    async findByUserAndPublication(id_publication, id_user) {
        return this.commentaireRepository.find({
            where: {
                publication: { id_publication },
                id_user
            },
            order: { date_commentaire: 'DESC' }
        });
    }
    async findByEtablissementAndPublication(id_publication, id_etablissement) {
        return this.commentaireRepository.find({
            where: {
                publication: { id_publication },
                id_user_etablissement_sante: id_etablissement
            },
            order: { date_commentaire: 'DESC' }
        });
    }
    async findByAdminAndPublication(id_publication, id_admin) {
        return this.commentaireRepository.find({
            where: {
                publication: { id_publication },
                id_admin_gestionnaire: id_admin
            },
            order: { date_commentaire: 'DESC' }
        });
    }
    async findByExpertAndPublication(id_publication, id_expert) {
        return this.commentaireRepository.find({
            where: {
                publication: { id_publication },
                id_expert
            },
            order: { date_commentaire: 'DESC' }
        });
    }
    async getCommentsCount(id_publication) {
        const count = await this.commentaireRepository.count({
            where: { publication: { id_publication } }
        });
        return { commentaires_count: count };
    }
};
exports.CommentaireService = CommentaireService;
exports.CommentaireService = CommentaireService = CommentaireService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(commentaire_entity_1.Commentaire)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CommentaireService);
//# sourceMappingURL=commentaire.service.js.map