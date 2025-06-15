"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpertSanteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_2 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const expert_sante_entity_1 = require("./entities/expert_sante.entity");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
let ExpertSanteService = class ExpertSanteService {
    constructor(expertSanteRepository, jwtService, dataSource) {
        this.expertSanteRepository = expertSanteRepository;
        this.jwtService = jwtService;
        this.dataSource = dataSource;
    }
    genererIdentifiantAleatoire() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    async creerExpert(dto, idEtab) {
        const hash = await bcrypt.hash(dto.mot_de_passe, 10);
        let identifiant;
        let existe;
        do {
            identifiant = this.genererIdentifiantAleatoire();
            [existe] = await this.dataSource.query(`SELECT * FROM expert_sante WHERE identifiant = $1`, [identifiant]);
        } while (existe);
        await this.dataSource.query(`INSERT INTO expert_sante 
      (id_user_etablissement_sante, nom, prenom, domaine_expertise, identifiant, mot_de_passe, url_profile)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
            idEtab,
            dto.nom,
            dto.prenom,
            dto.domaine_expertise,
            identifiant,
            hash,
            'https://res.cloudinary.com/dhrrk7vsd/image/upload/v1740670384/hostolink/xnverykielvbi1w2atjb.jpg',
        ]);
        return {
            message: '✅ Expert santé créé avec succès',
            identifiant,
        };
    }
    async loginExpert(identifiant, motDePasse) {
        const expert = await this.expertSanteRepository.findOne({ where: { identifiant } });
        if (!expert) {
            throw new common_1.NotFoundException("Identifiant incorrect");
        }
        const motDePasseValide = await bcrypt.compare(motDePasse, expert.mot_de_passe);
        if (!motDePasseValide) {
            throw new common_1.UnauthorizedException("Mot de passe incorrect");
        }
        const payload = { sub: expert.id_expert };
        const token = await this.jwtService.signAsync(payload);
        return {
            message: 'Connexion réussie',
            token,
            expert: {
                id: expert.id_expert,
                nom: expert.nom,
                prenom: expert.prenom,
                domaine_expertise: expert.domaine_expertise,
                identifiant: expert.identifiant,
                url_profile: expert.url_profile,
            }
        };
    }
    async updatePasswordExpert(identifiant, ancien, nouveau) {
        const expert = await this.expertSanteRepository.findOne({ where: { identifiant } });
        if (!expert) {
            throw new common_1.NotFoundException('Expert non trouvé');
        }
        const valide = await bcrypt.compare(ancien, expert.mot_de_passe);
        if (!valide) {
            throw new common_1.UnauthorizedException('Ancien mot de passe incorrect');
        }
        const hash = await bcrypt.hash(nouveau, 10);
        expert.mot_de_passe = hash;
        await this.expertSanteRepository.save(expert);
        return { message: 'Mot de passe mis à jour avec succès' };
    }
    async getExpertById(id) {
        const expert = await this.expertSanteRepository.findOne({ where: { id_expert: id } });
        if (!expert)
            throw new common_1.NotFoundException('Expert non trouvé');
        return {
            id: expert.id_expert,
            nom: expert.nom,
            prenom: expert.prenom,
            domaine_expertise: expert.domaine_expertise,
            identifiant: expert.identifiant,
            url_profile: expert.url_profile,
        };
    }
    async getExpertsByEtablissement(idEtab) {
        const experts = await this.expertSanteRepository.find({
            where: {
                user_etablissement_sante: {
                    id_user_etablissement_sante: idEtab,
                },
            },
            order: { id_expert: 'ASC' },
        });
        return {
            total: experts.length,
            experts: experts.map((e) => ({
                id: e.id_expert,
                nom: e.nom,
                prenom: e.prenom,
                domaine_expertise: e.domaine_expertise,
                identifiant: e.identifiant,
                url_profile: e.url_profile,
            })),
        };
    }
    async deleteExpertByEtablissement(idExpert, idEtab) {
        const expert = await this.expertSanteRepository.findOne({
            where: {
                id_expert: idExpert,
                user_etablissement_sante: {
                    id_user_etablissement_sante: idEtab,
                },
            },
        });
        if (!expert) {
            throw new common_1.NotFoundException("Cet expert n'existe pas ou ne vous appartient pas.");
        }
        await this.expertSanteRepository.remove(expert);
        return { message: 'Expert supprimé avec succès.' };
    }
    async updateAvatar(file, idExpert) {
        const expert = await this.expertSanteRepository.findOne({
            where: { id_expert: idExpert },
            relations: ['user_etablissement_sante'],
        });
        if (!expert) {
            throw new common_1.NotFoundException("Expert non trouvé");
        }
        const etabId = expert.user_etablissement_sante.id_user_etablissement_sante;
        const folder = `dossier_hostolink_preset/${etabId}_user_etablissement_sante/${idExpert}_expert`;
        if (expert.url_profile && expert.url_profile.includes('cloudinary.com')) {
            const publicId = this.extractPublicIdFromUrl(expert.url_profile);
            if (publicId) {
                await cloudinary_1.v2.uploader.destroy(publicId).catch(() => null);
            }
        }
        const uploadFromBuffer = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder,
                    public_id: 'profile',
                    overwrite: true,
                }, (error, result) => {
                    if (error || !result)
                        return reject(error);
                    resolve(result.secure_url);
                });
                stream_1.Readable.from(fileBuffer).pipe(uploadStream);
            });
        };
        const url = await uploadFromBuffer(file.buffer);
        expert.url_profile = url;
        await this.expertSanteRepository.save(expert);
        return { message: 'Photo de profil mise à jour avec succès', url };
    }
    extractPublicIdFromUrl(url) {
        const match = url.match(/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|gif)/);
        return match ? match[1] : null;
    }
};
exports.ExpertSanteService = ExpertSanteService;
exports.ExpertSanteService = ExpertSanteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(expert_sante_entity_1.ExpertSante)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        jwt_1.JwtService,
        typeorm_1.DataSource])
], ExpertSanteService);
//# sourceMappingURL=expert-sante.service.js.map