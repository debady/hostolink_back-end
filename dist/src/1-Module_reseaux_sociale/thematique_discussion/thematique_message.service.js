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
exports.ThematiqueDiscussionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../utilisateur/entities/user.entity");
const administrateur_entity_1 = require("../../administrateur/entities/administrateur.entity");
const message_thematique_entity_1 = require("./entities/message_thematique.entity");
const thematique_entity_1 = require("./entities/thematique.entity");
const expert_sante_entity_1 = require("../../user_etablissement_sante/entities/expert_sante.entity");
let ThematiqueDiscussionService = class ThematiqueDiscussionService {
    constructor(messageRepo, thematiqueRepo, userRepo, adminRepo, expertRepo) {
        this.messageRepo = messageRepo;
        this.thematiqueRepo = thematiqueRepo;
        this.userRepo = userRepo;
        this.adminRepo = adminRepo;
        this.expertRepo = expertRepo;
    }
    async createMessage(dto) {
        const thematique = await this.thematiqueRepo.findOneBy({
            id_thematique_discussion: dto.id_thematique_discussion,
        });
        if (!thematique) {
            throw new common_1.NotFoundException('Thématique non trouvée');
        }
        const expediteur = await this.userRepo.findOneBy({ id_user: dto.id_expediteur });
        if (!expediteur) {
            throw new common_1.NotFoundException('Expéditeur introuvable');
        }
        const message = this.messageRepo.create({
            thematique,
            expediteur,
            contenu: dto.contenu,
            type_message: dto.type_message,
            url_image: dto.url_image || undefined,
            status_reponse: false,
        });
        const savedMessage = await this.messageRepo.save(message);
        return savedMessage;
    }
    async getAllThematiques() {
        return this.thematiqueRepo.find({
            relations: ['administrateur'],
            order: { date_ajout: 'DESC' },
        });
    }
    async createThematique(dto) {
        const admin = await this.adminRepo.findOneBy({
            id_admin_gestionnaire: dto.id_admin_gestionnaire,
        });
        if (!admin) {
            throw new common_1.NotFoundException('Administrateur introuvable');
        }
        const nouvelleThematique = this.thematiqueRepo.create({
            administrateur: admin,
            titre_thematique: dto.titre_thematique,
            sous_titre: dto.sous_titre,
            image: dto.image,
            description: dto.description,
            nbre_expert: dto.nbre_expert || 0,
        });
        return this.thematiqueRepo.save(nouvelleThematique);
    }
    async getMessagesByThematique(id_thematique_discussion) {
        const messages = await this.messageRepo.find({
            where: {
                thematique: { id_thematique_discussion },
            },
            relations: ['expediteur', 'expert'],
            order: {
                date_envoi: 'ASC',
            },
        });
        return messages;
    }
    async marquerMessagesCommeLus(id_thematique, id_user) {
        await this.messageRepo.update({
            thematique: { id_thematique_discussion: id_thematique },
            expediteur: { id_user: (0, typeorm_2.Not)(id_user) },
            est_lu: false,
        }, { est_lu: true });
    }
    async repondreEnTantQueExpert(dto) {
        const thematique = await this.thematiqueRepo.findOneBy({
            id_thematique_discussion: dto.id_thematique_discussion,
        });
        if (!thematique)
            throw new common_1.NotFoundException('Thématique non trouvée');
        const expert = await this.expertRepo.findOneBy({ id_expert: dto.id_expert });
        if (!expert)
            throw new common_1.NotFoundException('Expert introuvable');
        const message = this.messageRepo.create({
            thematique,
            expert,
            contenu: dto.contenu,
            type_message: dto.type_message,
            url_image: dto.url_image || undefined,
            status_reponse: true,
        });
        return await this.messageRepo.save(message);
    }
};
exports.ThematiqueDiscussionService = ThematiqueDiscussionService;
exports.ThematiqueDiscussionService = ThematiqueDiscussionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_thematique_entity_1.MessageThematique)),
    __param(1, (0, typeorm_1.InjectRepository)(thematique_entity_1.Thematique)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(administrateur_entity_1.Administrateur)),
    __param(4, (0, typeorm_1.InjectRepository)(expert_sante_entity_1.ExpertSante)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ThematiqueDiscussionService);
//# sourceMappingURL=thematique_message.service.js.map