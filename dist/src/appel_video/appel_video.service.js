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
exports.AppelVideoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appel_video_entity_1 = require("./entities/appel_video.entity");
const expert_sante_entity_1 = require("../user_etablissement_sante/entities/expert_sante.entity");
const uuid_1 = require("uuid");
const user_entity_1 = require("../utilisateur/entities/user.entity");
const disponibilite_expert_entity_1 = require("./entities/disponibilite_expert.entity");
const agora_access_token_1 = require("agora-access-token");
let AppelVideoService = class AppelVideoService {
    constructor(appelRepo, userRepo, dispoRepo, expertRepo) {
        this.appelRepo = appelRepo;
        this.userRepo = userRepo;
        this.dispoRepo = dispoRepo;
        this.expertRepo = expertRepo;
    }
    async genererTokenAgora(canal, uid) {
        const appID = process.env.AGORA_APP_ID;
        const appCertificate = process.env.AGORA_APP_CERTIFICATE;
        if (!appID || !appCertificate) {
            throw new Error('❌ Variables AGORA_APP_ID ou AGORA_APP_CERTIFICATE non définies');
        }
        const expirationTimeInSeconds = 3600;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
        return agora_access_token_1.RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, canal, uid, agora_access_token_1.RtcRole.PUBLISHER, privilegeExpiredTs);
    }
    async lancerAppel(dto) {
        console.log('📥 Requête reçue pour lancer un appel avec ID utilisateur :', dto.id_user);
        const user = await this.userRepo.findOne({ where: { id_user: dto.id_user } });
        if (!user) {
            console.error('❌ Utilisateur introuvable avec l’ID :', dto.id_user);
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        console.log('✅ Utilisateur trouvé :', user.nom || user.email || user.id_user);
        const dispos = await this.dispoRepo.find({
            where: { est_connecte: true },
            order: { derniere_connexion: 'DESC' },
        });
        console.log('📋 Experts disponibles trouvés :', dispos.length);
        let expert = null;
        let dispoValide = null;
        for (const dispo of dispos) {
            console.log('🔍 Vérification de disponibilité pour id_expert =', dispo.id_expert);
            const e = await this.expertRepo.findOne({ where: { id_expert: dispo.id_expert } });
            if (e) {
                console.log('✅ Expert trouvé :', e.nom, e.prenom, '(id:', e.id_expert, ')');
                expert = e;
                dispoValide = dispo;
                break;
            }
            else {
                console.warn('⚠️ Expert introuvable pour id_expert =', dispo.id_expert);
            }
        }
        if (!expert) {
            console.error('❌ Aucun expert valide disponible actuellement');
            throw new common_1.BadRequestException('Aucun expert disponible actuellement');
        }
        const canal = `hostolink-${(0, uuid_1.v4)()}`;
        const token = `token-${(0, uuid_1.v4)()}`;
        console.log('📡 Canal Agora généré :', canal);
        console.log('🔐 Token Agora généré :', token);
        const nouvelAppel = this.appelRepo.create({
            utilisateur: user,
            expert: expert,
            canal_agora: canal,
            token_agora: token,
            status_appel: 'en_attente',
            latitude: dto.latitude,
            longitude: dto.longitude,
        });
        const appelSauvegarde = await this.appelRepo.save(nouvelAppel);
        console.log('✅ Appel vidéo enregistré avec succès. ID appel :', appelSauvegarde.id_appel);
        return appelSauvegarde;
    }
    async terminerAppel(id_appel, dto) {
        const appel = await this.appelRepo.findOne({ where: { id_appel } });
        if (!appel) {
            throw new common_1.NotFoundException('Appel introuvable');
        }
        appel.status_appel = 'termine';
        appel.date_fin = new Date();
        appel.compte_rendu = dto.compte_rendu ?? null;
        await this.appelRepo.save(appel);
        return {
            message: '✅ Appel terminé avec succès',
            appel,
        };
    }
    async verifierAppelActif(id_user) {
        const appel = await this.appelRepo.findOne({
            where: {
                utilisateur: { id_user },
                status_appel: (0, typeorm_2.In)(['en_attente', 'en_cours']),
            },
            relations: ['expert'],
            order: { date_debut: 'DESC' },
        });
        if (!appel) {
            return { actif: false, message: 'Aucun appel actif pour cet utilisateur.' };
        }
        return {
            actif: true,
            appel,
        };
    }
    async historiqueAppels(id_user) {
        const appels = await this.appelRepo.find({
            where: {
                utilisateur: { id_user },
                status_appel: 'termine',
            },
            relations: ['expert'],
            order: { date_debut: 'DESC' },
        });
        return {
            total: appels.length,
            appels,
        };
    }
    async changerStatusAppel(id_appel, dto) {
        const appel = await this.appelRepo.findOne({ where: { id_appel } });
        if (!appel) {
            throw new common_1.NotFoundException('Appel non trouvé');
        }
        appel.status_appel = dto.status_appel;
        return await this.appelRepo.save(appel);
    }
    async annulerAppel(id_appel) {
        const result = await this.appelRepo.delete({ id_appel });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Appel introuvable');
        }
        return { message: '✅ Appel annulé avec succès' };
    }
    async mettreAJourDisponibilite(id_expert, dto) {
        const dispo = await this.dispoRepo.findOne({ where: { id_expert } });
        if (!dispo) {
            throw new common_1.NotFoundException('Expert non inscrit dans disponibilite_expert');
        }
        dispo.est_connecte = dto.est_connecte;
        dispo.derniere_connexion = new Date();
        if (dto.zone_couverte) {
            dispo.zone_couverte = dto.zone_couverte;
        }
        return await this.dispoRepo.save(dispo);
    }
    async listerExpertsDisponibles() {
        return this.dispoRepo.find({
            where: { est_connecte: true },
            order: { derniere_connexion: 'DESC' },
            relations: ['expert'],
        });
    }
    async appelsEnAttentePourExpert(id_expert) {
        const appels = await this.appelRepo.find({
            where: {
                expert: { id_expert },
                status_appel: 'en_attente',
            },
            relations: ['utilisateur'],
            order: { date_debut: 'DESC' },
        });
        return appels;
    }
    async accepterAppel(id_appel) {
        const appel = await this.appelRepo.findOne({ where: { id_appel } });
        if (!appel) {
            throw new common_1.NotFoundException('Appel introuvable');
        }
        if (appel.status_appel !== 'en_attente') {
            throw new common_1.BadRequestException('Cet appel ne peut pas être accepté (déjà en cours ou terminé)');
        }
        appel.status_appel = 'en_cours';
        await this.appelRepo.save(appel);
        return {
            message: '✅ Appel accepté avec succès',
            appel,
        };
    }
    async terminerAppelParExpert(id_appel, dto) {
        const appel = await this.appelRepo.findOne({ where: { id_appel } });
        if (!appel) {
            throw new common_1.NotFoundException('Appel introuvable');
        }
        appel.status_appel = 'termine';
        appel.date_fin = new Date();
        appel.compte_rendu = dto.compte_rendu ?? null;
        await this.appelRepo.save(appel);
        return {
            message: '✅ Appel terminé par l\'expert avec succès',
            appel,
        };
    }
    async historiqueAppelsExpert(id_expert) {
        const appels = await this.appelRepo.find({
            where: {
                expert: { id_expert },
                status_appel: 'termine',
            },
            relations: ['utilisateur'],
            order: { date_debut: 'DESC' },
        });
        return {
            total: appels.length,
            appels,
        };
    }
    async refuserAppel(id_appel, dto) {
        const appel = await this.appelRepo.findOne({ where: { id_appel } });
        if (!appel) {
            throw new common_1.NotFoundException('Appel introuvable');
        }
        if (appel.status_appel !== 'en_attente') {
            throw new common_1.BadRequestException('Seuls les appels en attente peuvent être refusés');
        }
        appel.status_appel = 'refuse';
        if (dto.motif) {
            appel.compte_rendu = dto.motif;
        }
        await this.appelRepo.save(appel);
        return {
            message: '🚫 Appel refusé par l\'expert',
            appel,
        };
    }
    async verifierAppelEnCoursPourExpert(id_expert) {
        const appel = await this.appelRepo.findOne({
            where: {
                expert: { id_expert },
                status_appel: 'en_cours',
            },
            relations: ['utilisateur'],
            order: { date_debut: 'DESC' },
        });
        if (!appel) {
            return {
                en_cours: false,
                message: 'Aucun appel en cours',
            };
        }
        return {
            en_cours: true,
            appel: {
                id_appel: appel.id_appel,
                canal_agora: appel.canal_agora,
                token_agora: appel.token_agora,
                date_debut: appel.date_debut,
                utilisateur: {
                    id_user: appel.utilisateur?.id_user,
                    nom: appel.utilisateur?.nom,
                    prenom: appel.utilisateur?.prenom,
                }
            },
        };
    }
};
exports.AppelVideoService = AppelVideoService;
exports.AppelVideoService = AppelVideoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appel_video_entity_1.AppelVideo)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(disponibilite_expert_entity_1.DisponibiliteExpert)),
    __param(3, (0, typeorm_1.InjectRepository)(expert_sante_entity_1.ExpertSante)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AppelVideoService);
//# sourceMappingURL=appel_video.service.js.map