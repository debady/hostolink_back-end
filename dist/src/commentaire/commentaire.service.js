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
exports.CommentaireService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const commentaire_entity_1 = require("./entities/commentaire.entity");
const publication_entity_1 = require("../publication/entities/publication.entity");
const user_entity_1 = require("../user/entities/user.entity");
let CommentaireService = class CommentaireService {
    constructor(commentaireRepository, publicationRepository, userRepository) {
        this.commentaireRepository = commentaireRepository;
        this.publicationRepository = publicationRepository;
        this.userRepository = userRepository;
    }
    async create(id_publication, createCommentaireDto) {
        const { id_user, contenu } = createCommentaireDto;
        const publication = await this.publicationRepository.findOne({
            where: { id_publication },
        });
        if (!publication) {
            throw new common_1.NotFoundException(`Publication avec id ${id_publication} non trouvée`);
        }
        const user = await this.userRepository.findOne({
            where: { id_user },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec id ${id_user} non trouvé`);
        }
        const commentaire = this.commentaireRepository.create({
            contenu,
            publication,
            user,
        });
        return this.commentaireRepository.save(commentaire);
    }
    async findByPublicationId(id_publication) {
        return this.commentaireRepository.find({
            where: { publication: { id_publication } },
            relations: ['user'],
            order: { date_commentaire: 'DESC' },
        });
    }
    async findByPublicationIdAndUserId(id_publication, id_user) {
        return this.commentaireRepository.find({
            where: {
                publication: { id_publication },
                user: { id_user },
            },
            relations: ['user'],
            order: { date_commentaire: 'DESC' },
        });
    }
};
exports.CommentaireService = CommentaireService;
exports.CommentaireService = CommentaireService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(commentaire_entity_1.Commentaire)),
    __param(1, (0, typeorm_1.InjectRepository)(publication_entity_1.Publication)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CommentaireService);
//# sourceMappingURL=commentaire.service.js.map