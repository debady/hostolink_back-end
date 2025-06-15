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
exports.AnnonceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const annonce_entity_1 = require("./entities/annonce.entity");
const administrateur_entity_1 = require("../administrateur/entities/administrateur.entity");
let AnnonceService = class AnnonceService {
    constructor(annonceRepository, adminRepository) {
        this.annonceRepository = annonceRepository;
        this.adminRepository = adminRepository;
    }
    async createAnnonce(dto) {
        const admin = await this.adminRepository.findOne({ where: { id_admin_gestionnaire: dto.id_admin_gestionnaire } });
        if (!admin) {
            throw new common_1.NotFoundException('Administrateur introuvable');
        }
        const annonce = this.annonceRepository.create({
            titre_annonce: dto.titre_annonce,
            description_annonce: dto.description_annonce,
            url_images: dto.url_images,
            id_admin_gestionnaire: admin,
        });
        return await this.annonceRepository.save(annonce);
    }
    async getAllAnnonces() {
        return await this.annonceRepository.find({
            relations: ['id_admin_gestionnaire'],
            order: { date: 'DESC' },
        });
    }
    async updateAnnonce(id, dto) {
        const annonce = await this.annonceRepository.findOne({ where: { id_annonce: id } });
        if (!annonce) {
            throw new common_1.NotFoundException('Annonce non trouvée');
        }
        Object.assign(annonce, dto);
        return await this.annonceRepository.save(annonce);
    }
    async deleteAnnonce(id) {
        const annonce = await this.annonceRepository.findOne({ where: { id_annonce: id } });
        if (!annonce) {
            throw new common_1.NotFoundException('Annonce non trouvée');
        }
        await this.annonceRepository.remove(annonce);
        return { message: 'Annonce supprimée avec succès' };
    }
};
exports.AnnonceService = AnnonceService;
exports.AnnonceService = AnnonceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(annonce_entity_1.Annonce)),
    __param(1, (0, typeorm_1.InjectRepository)(administrateur_entity_1.Administrateur)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AnnonceService);
//# sourceMappingURL=annonce.service.js.map