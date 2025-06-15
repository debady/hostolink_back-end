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
var PublicationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const publication_entity_1 = require("./entities/publication.entity");
const social_cloudinary_service_1 = require("../../social_cloudinary/social_cloudinary.service");
let PublicationService = PublicationService_1 = class PublicationService {
    constructor(publicationRepository, SocialCloudinaryService) {
        this.publicationRepository = publicationRepository;
        this.SocialCloudinaryService = SocialCloudinaryService;
        this.logger = new common_1.Logger(PublicationService_1.name);
    }
    async create(data, imageFile) {
        if (!data || typeof data !== 'object') {
            throw new common_1.BadRequestException('Données de publication manquantes ou invalides.');
        }
        this.validateSingleAuthor(data);
        let imageUrl = undefined;
        if (imageFile) {
            try {
                imageUrl = await this.SocialCloudinaryService.uploadImage(imageFile);
            }
            catch (error) {
                throw new common_1.BadRequestException('Erreur lors de l’upload de l’image : ' + error.message);
            }
        }
        const publicationData = {
            titre_publication: data.titre_publication,
            contenu: data.contenu,
            image: imageUrl,
            compteur_like: 0,
        };
        if (data.id_user)
            publicationData.id_user = data.id_user;
        if (data.id_user_etablissement_sante)
            publicationData.id_user_etablissement_sante = data.id_user_etablissement_sante;
        if (data.id_admin_gestionnaire)
            publicationData.id_admin_gestionnaire = data.id_admin_gestionnaire;
        if (data.id_expert)
            publicationData.id_expert = data.id_expert;
        const publication = this.publicationRepository.create(publicationData);
        const savedPublication = await this.publicationRepository.save(publication);
        this.logger.log(`✅ Publication créée avec ID: ${savedPublication.id_publication}`);
        return savedPublication;
    }
    validateSingleAuthor(data) {
        if (!data || typeof data !== 'object') {
            throw new common_1.BadRequestException('Données invalides pour valider l’auteur.');
        }
        const authorFields = [
            data.id_user,
            data.id_user_etablissement_sante,
            data.id_admin_gestionnaire,
            data.id_expert,
        ].filter((field) => field !== undefined && field !== null);
        if (authorFields.length === 0) {
            throw new common_1.BadRequestException('Au moins un ID d\'auteur doit être fourni (user, établissement, admin ou expert)');
        }
        if (authorFields.length > 1) {
            throw new common_1.BadRequestException('Un seul ID d\'auteur doit être fourni');
        }
    }
    async findAll() {
        return this.publicationRepository.find({
            relations: ['commentaires', 'partages'],
            order: { date_publication: 'DESC' },
        });
    }
    async findOne(id) {
        const publication = await this.publicationRepository.findOne({
            where: { id_publication: id },
            relations: ['commentaires', 'partages'],
        });
        if (!publication) {
            throw new common_1.NotFoundException(`Publication avec l'ID ${id} non trouvée`);
        }
        return publication;
    }
    async findByUser(id_user) {
        return this.publicationRepository.find({
            where: { id_user },
            relations: ['commentaires', 'partages'],
            order: { date_publication: 'DESC' },
        });
    }
    async findByEtablissement(id_user_etablissement_sante) {
        return this.publicationRepository.find({
            where: { id_user_etablissement_sante },
            relations: ['commentaires', 'partages'],
            order: { date_publication: 'DESC' },
        });
    }
    async findByAdmin(id_admin_gestionnaire) {
        return this.publicationRepository.find({
            where: { id_admin_gestionnaire },
            relations: ['commentaires', 'partages'],
            order: { date_publication: 'DESC' },
        });
    }
    async findByExpert(id_expert) {
        return this.publicationRepository.find({
            where: { id_expert },
            relations: ['commentaires', 'partages'],
            order: { date_publication: 'DESC' },
        });
    }
    async likePost(id) {
        const publication = await this.findOne(id);
        publication.compteur_like += 1;
        return this.publicationRepository.save(publication);
    }
    async dislikePost(id) {
        const publication = await this.findOne(id);
        if (publication.compteur_like > 0) {
            publication.compteur_like -= 1;
        }
        return this.publicationRepository.save(publication);
    }
    async getLikesCount(id) {
        const publication = await this.publicationRepository.findOne({
            where: { id_publication: id },
            select: ['compteur_like']
        });
        if (!publication) {
            throw new common_1.NotFoundException(`Publication avec l'ID ${id} non trouvée`);
        }
        return { compteur_like: publication.compteur_like };
    }
};
exports.PublicationService = PublicationService;
exports.PublicationService = PublicationService = PublicationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(publication_entity_1.Publication)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        social_cloudinary_service_1.SocialCloudinaryServicess])
], PublicationService);
//# sourceMappingURL=publication.service.js.map