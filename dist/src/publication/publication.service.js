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
exports.PublicationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const publication_entity_1 = require("./entities/publication.entity");
const commentaire_entity_1 = require("../commentaire/entities/commentaire.entity");
const cloudinary_1 = require("cloudinary");
let PublicationService = class PublicationService {
    constructor(publicationRepository, commentaireRepository, cloudinaryService) {
        this.publicationRepository = publicationRepository;
        this.commentaireRepository = commentaireRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async uploadImageToCloudinary(file) {
        if (!file || !file.buffer) {
            throw new Error('Le fichier est invalide ou non reçu');
        }
        try {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'dossier_hostolink_preset' }, (error, result) => {
                    if (error) {
                        console.error('❌ Erreur Cloudinary:', error);
                        reject(new Error('Échec du téléchargement sur Cloudinary'));
                    }
                    else if (!result || !result.secure_url) {
                        reject(new Error('Cloudinary n\'a retourné aucun résultat'));
                    }
                    else {
                        resolve(result);
                    }
                });
                stream.end(file.buffer);
            });
            return result.secure_url;
        }
        catch (error) {
            console.error('❌ Erreur Cloudinary:', error);
            return undefined;
        }
    }
    async create(createPublicationDto, file) {
        const { id_user, ...publicationData } = createPublicationDto;
        let imageUrl;
        if (file) {
            imageUrl = await this.uploadImageToCloudinary(file) ?? undefined;
        }
        const publication = this.publicationRepository.create({
            ...publicationData,
            image: imageUrl,
            date_publication: new Date(),
            compteur_like: 0,
            user: { id_user }
        });
        return this.publicationRepository.save(publication);
    }
    async findOne(id_publication) {
        const publication = await this.publicationRepository.findOne({
            where: { id_publication },
            relations: ['user', 'commentaires', 'commentaires.user'],
        });
        if (!publication) {
            throw new common_1.NotFoundException(`Publication avec l'ID ${id_publication} non trouvée`);
        }
        return publication;
    }
    async likePost(id_publication) {
        const publication = await this.publicationRepository.findOne({ where: { id_publication } });
        if (!publication) {
            throw new Error('Publication not found');
        }
        publication.compteur_like += 1;
        return this.publicationRepository.save(publication);
    }
    async dislikePost(id_publication) {
        const publication = await this.publicationRepository.findOne({ where: { id_publication } });
        if (!publication) {
            throw new Error('Publication not found');
        }
        if (publication.compteur_like > 0) {
            publication.compteur_like -= 1;
        }
        return this.publicationRepository.save(publication);
    }
    async findAll() {
        return this.publicationRepository.find({
            relations: ['user', 'commentaires', 'commentaires.user'],
            order: { date_publication: 'DESC' },
        });
    }
    async findByUserId(userId) {
        return this.publicationRepository.find({
            where: { user: { id_user: userId } },
            relations: ['user', 'commentaires', 'commentaires.user'],
            order: { date_publication: 'DESC' },
        });
    }
    async addComment(createCommentaireDto) {
        const { id_publication, id_user, contenu } = createCommentaireDto;
        const publication = await this.publicationRepository.findOne({
            where: { id_publication }
        });
        if (!publication) {
            throw new Error('Publication not found');
        }
        const commentaire = this.commentaireRepository.create({
            contenu,
            publication: { id_publication },
            user: { id_user }
        });
        return this.commentaireRepository.save(commentaire);
    }
    async getCommentsByPublicationId(id_publication) {
        return this.commentaireRepository.find({
            where: { publication: { id_publication } },
            relations: ['user'],
            order: { date_commentaire: 'DESC' },
        });
    }
    async deletePublication(id_publication, id_user) {
        const publication = await this.publicationRepository.findOne({
            where: { id_publication },
            relations: ['user', 'commentaires'],
        });
        if (!publication) {
            throw new common_1.NotFoundException(`Publication avec l'ID ${id_publication} non trouvée.`);
        }
        if (publication.user.id_user !== id_user) {
            throw new Error('Vous n\'êtes pas autorisé à supprimer cette publication.');
        }
        if (publication.image) {
            try {
                const publicId = publication.image.split('/').pop()?.split('.')[0];
                await cloudinary_1.v2.uploader.destroy(`publications/${publicId}`);
            }
            catch (error) {
                console.error('❌ Erreur lors de la suppression de l’image sur Cloudinary:', error);
            }
        }
        if (publication.commentaires && publication.commentaires.length > 0) {
            await this.commentaireRepository.remove(publication.commentaires);
        }
        await this.publicationRepository.remove(publication);
        console.log(`📢 L'utilisateur ID ${id_user} a supprimé la publication ID ${id_publication}`);
        return { success: true, message: 'Publication supprimée avec succès.' };
    }
};
exports.PublicationService = PublicationService;
exports.PublicationService = PublicationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(publication_entity_1.Publication)),
    __param(1, (0, typeorm_1.InjectRepository)(commentaire_entity_1.Commentaire)),
    __param(2, (0, common_1.Inject)('Cloudinary')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object])
], PublicationService);
//# sourceMappingURL=publication.service.js.map