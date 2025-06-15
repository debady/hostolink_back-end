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
exports.ListeNumeroEtablissementSanteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cloudinary_service_1 = require("../upload/cloudinary.service");
const administrateur_entity_1 = require("../administrateur/entities/administrateur.entity");
const liste_numero_vert_etablissement_sante_entity_1 = require("./entities/liste_numero_vert_etablissement_sante.entity");
let ListeNumeroEtablissementSanteService = class ListeNumeroEtablissementSanteService {
    constructor(listeNumeroRepo, adminRepo, cloudinaryService) {
        this.listeNumeroRepo = listeNumeroRepo;
        this.adminRepo = adminRepo;
        this.cloudinaryService = cloudinaryService;
    }
    async create(dto, file) {
        let imageUrl = dto.image ?? '';
        const categoriesValides = ['hopital', 'clinique', 'pharmacie', 'urgence'];
        if (!categoriesValides.includes(dto.categorie.toLowerCase())) {
            throw new common_1.BadRequestException(`La catégorie '${dto.categorie}' n'est pas valide.`);
        }
        if (file) {
            try {
                imageUrl = await this.cloudinaryService.uploadImage(file);
            }
            catch (error) {
                throw new common_1.InternalServerErrorException('Échec de l’upload de l’image sur Cloudinary.');
            }
        }
        const admin = await this.adminRepo.findOne({ where: { id_admin_gestionnaire: dto.id_admin_gestionnaire } });
        if (!admin) {
            throw new common_1.NotFoundException(`Administrateur avec l'ID ${dto.id_admin_gestionnaire} non trouvé.`);
        }
        const newNumero = this.listeNumeroRepo.create({
            ...dto,
            image: imageUrl,
            type_etablissement: dto.type_etablissement.toLowerCase(),
            categorie: dto.categorie.toLowerCase(),
            administrateur: admin,
        });
        return await this.listeNumeroRepo.save(newNumero);
    }
    async findAll() {
        const numeros = await this.listeNumeroRepo.find({ relations: ['administrateur'] });
        return numeros.map(numero => this.mapToResponseDto(numero));
    }
    async findOne(id) {
        if (!id || isNaN(id)) {
            throw new Error('ID invalide. Un entier valide est requis.');
        }
        const numero = await this.listeNumeroRepo.findOne({
            where: { id_liste_num_etablissement_sante: id },
            relations: ['administrateur'],
        });
        if (!numero) {
            throw new common_1.NotFoundException(`Numéro vert avec l'ID ${id} non trouvé`);
        }
        return this.mapToResponseDto(numero);
    }
    async findByCategory(categorie) {
        if (!categorie || categorie.toLowerCase() === 'tous') {
            return this.findAll();
        }
        const categoriesValides = ['hopital', 'clinique', 'pharmacie'];
        if (!categoriesValides.includes(categorie.toLowerCase())) {
            throw new common_1.NotFoundException(`La catégorie '${categorie}' n'est pas valide.`);
        }
        const numeros = await this.listeNumeroRepo.find({
            where: { categorie: categorie.toLowerCase() },
            relations: ['administrateur'],
        });
        return numeros.map(numero => this.mapToResponseDto(numero));
    }
    async update(id, dto, file) {
        const numero = await this.listeNumeroRepo.findOne({ where: { id_liste_num_etablissement_sante: id } });
        if (!numero) {
            throw new common_1.NotFoundException(`Numéro vert avec l'ID ${id} non trouvé.`);
        }
        let imageUrl = numero.image;
        if (file) {
            try {
                imageUrl = await this.cloudinaryService.uploadImage(file);
            }
            catch (error) {
                throw new common_1.InternalServerErrorException('Erreur lors de l’upload de l’image sur Cloudinary.');
            }
        }
        await this.listeNumeroRepo.update(id, {
            ...dto,
            image: imageUrl,
            type_etablissement: dto.type_etablissement?.toLowerCase() ?? '',
            categorie: dto.categorie?.toLowerCase() ?? '',
        });
        return { message: 'Établissement mis à jour avec succès', id };
    }
    async remove(id) {
        const numero = await this.listeNumeroRepo.findOne({ where: { id_liste_num_etablissement_sante: id } });
        if (!numero) {
            throw new common_1.NotFoundException(`Numéro vert avec l'ID ${id} non trouvé.`);
        }
        await this.listeNumeroRepo.delete(id);
        return { message: `Numéro vert avec l'ID ${id} supprimé avec succès.` };
    }
    mapToResponseDto(numero) {
        return {
            id_liste_num_etablissement_sante: numero.id_liste_num_etablissement_sante,
            id_admin_gestionnaire: numero.administrateur.id_admin_gestionnaire,
            nom_etablissement: numero.nom_etablissement,
            contact: numero.contact,
            image: numero.image,
            presentation: numero.presentation,
            adresse: numero.adresse,
            latitude: numero.latitude,
            longitude: numero.longitude,
            type_etablissement: numero.type_etablissement,
            categorie: numero.categorie,
            site_web: numero.site_web,
        };
    }
};
exports.ListeNumeroEtablissementSanteService = ListeNumeroEtablissementSanteService;
exports.ListeNumeroEtablissementSanteService = ListeNumeroEtablissementSanteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(liste_numero_vert_etablissement_sante_entity_1.ListeNumeroEtablissementSante)),
    __param(1, (0, typeorm_1.InjectRepository)(administrateur_entity_1.Administrateur)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        cloudinary_service_1.CloudinaryService])
], ListeNumeroEtablissementSanteService);
//# sourceMappingURL=liste_numero_etablissement_sante.service.js.map