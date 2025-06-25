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
exports.AdministrateurService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const administrateur_entity_1 = require("./entities/administrateur.entity");
const jwt_1 = require("@nestjs/jwt");
const image_entity_1 = require("../image/entities/image.entity");
const typeorm_3 = require("typeorm");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let AdministrateurService = class AdministrateurService {
    constructor(adminRepository, jwtService, cloudinaryProvider, imageRepository, dataSource) {
        this.adminRepository = adminRepository;
        this.jwtService = jwtService;
        this.cloudinaryProvider = cloudinaryProvider;
        this.imageRepository = imageRepository;
        this.dataSource = dataSource;
    }
    async inscrireAdministrateur(dto) {
        const existant = await this.adminRepository.findOne({
            where: [{ email: dto.email }, { telephone: dto.telephone }],
        });
        if (existant)
            throw new common_1.ConflictException('Email ou téléphone déjà utilisé.');
        if (!dto.mot_de_passe || dto.mot_de_passe.length < 4) {
            throw new common_1.BadRequestException('Le mot de passe doit contenir au moins 4caractères.');
        }
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(dto.mot_de_passe, salt);
        const role = dto.role || 'admin';
        const administrateur = this.adminRepository.create({
            email: dto.email,
            telephone: dto.telephone,
            mot_de_passe: hash,
            role,
            nom: dto.nom,
            prenom: dto.prenom,
            adresse: dto.adresse,
            solde_de_rechargement: dto.solde_de_rechargement || 0,
            cumule_des_transactions: dto.cumule_des_transactions || 0,
        });
        try {
            const nouvelAdmin = await this.adminRepository.save(administrateur);
            return {
                message: 'Administrateur inscrit avec succès',
                administrateur: {
                    id: nouvelAdmin.id_admin_gestionnaire,
                    email: nouvelAdmin.email,
                    telephone: nouvelAdmin.telephone,
                    role: nouvelAdmin.role,
                },
            };
        }
        catch (error) {
            throw new Error('Une erreur est survenue lors de l’inscription.');
        }
    }
    async connexionAdministrateur(dto) {
        if (!dto.email && !dto.telephone) {
            throw new common_1.BadRequestException('Vous devez fournir soit un email, soit un numéro de téléphone.');
        }
        let admin;
        if (dto.email) {
            admin = await this.adminRepository.findOneBy({ email: dto.email });
        }
        else if (dto.telephone) {
            admin = await this.adminRepository.findOneBy({ telephone: dto.telephone });
        }
        if (!admin) {
            throw new common_1.UnauthorizedException('Identifiants incorrects');
        }
        const isPasswordValid = await bcrypt.compare(dto.mot_de_passe, admin.mot_de_passe);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Identifiants incorrects');
        }
        const payload = { id: admin.id_admin_gestionnaire, role: admin.role };
        const token = this.jwtService.sign(payload);
        const fullAdmin = await this.getAdminById(admin.id_admin_gestionnaire);
        return {
            message: 'Connexion réussie',
            administrateur: fullAdmin,
            access_token: token,
        };
    }
    async getAdminById(id) {
        const admin = await this.adminRepository.findOne({
            where: { id_admin_gestionnaire: id },
            select: [
                'id_admin_gestionnaire',
                'email',
                'telephone',
                'role',
                'permissions',
                'statut',
                'dernier_connexion',
                'date_creation',
                'date_modification',
                'nom',
                'prenom',
                'adresse',
                'solde_de_rechargement',
                'cumule_des_transactions',
            ],
        });
        if (!admin) {
            throw new common_1.NotFoundException('Administrateur non trouvé.');
        }
        const avatar = await this.imageRepository.findOne({
            where: { id_admin_gestionnaire: id, motif: image_entity_1.ImageMotifEnum.AVATAR_ADMIN },
        });
        return {
            ...admin,
            avatar_url: avatar ? avatar.url_image : null,
        };
    }
    async uploadAvatarAdmin(id, avatar) {
        const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
        if (!admin)
            throw new common_1.NotFoundException('Administrateur non trouvé.');
        const uploadResult = await this.cloudinaryProvider.uploader.upload(avatar.path, {
            folder: 'dossier_hostolink_preset/avatars_admin',
            public_id: `admin_${id}_${Date.now()}`,
            overwrite: true,
        });
        const ancienneImage = await this.imageRepository.findOne({
            where: { id_admin_gestionnaire: id, motif: image_entity_1.ImageMotifEnum.AVATAR_ADMIN },
        });
        if (ancienneImage) {
            const ancienneUrl = ancienneImage.url_image;
            const publicId = ancienneUrl?.split('/').pop()?.split('.')[0];
            if (publicId) {
                await this.cloudinaryProvider.uploader.destroy(`avatars_admin/${publicId}`);
            }
            ancienneImage.url_image = uploadResult.secure_url;
            await this.imageRepository.save(ancienneImage);
        }
        else {
            const nouvelleImage = this.imageRepository.create({
                url_image: uploadResult.secure_url,
                motif: image_entity_1.ImageMotifEnum.AVATAR_ADMIN,
                id_admin_gestionnaire: id,
            });
            await this.imageRepository.save(nouvelleImage);
        }
        return {
            message: 'Avatar administrateur uploadé avec succès',
            url_image: uploadResult.secure_url,
        };
    }
    async supprimerAdministrateur(id) {
        const resultat = await this.adminRepository.delete(id);
        if (resultat.affected === 0) {
            throw new common_1.NotFoundException("Administrateur non trouvé.");
        }
        return { message: 'Administrateur supprimé avec succès.' };
    }
    async modifierStatutAdministrateur(id, statut) {
        const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
        if (!admin) {
            throw new common_1.NotFoundException("Administrateur non trouvé.");
        }
        admin.statut = statut;
        await this.adminRepository.save(admin);
        return { message: `Statut modifié avec succès en "${statut}".` };
    }
    async modifierAdministrateur(id, dto) {
        const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
        if (!admin) {
            throw new common_1.NotFoundException("Administrateur non trouvé.");
        }
        Object.assign(admin, dto, { date_modification: new Date() });
        await this.adminRepository.save(admin);
        return { message: 'Informations administrateur modifiées avec succès.', admin };
    }
    async recupererTousLesAdmins() {
        const [admins, nombre] = await this.adminRepository.findAndCount();
        const adminsAvecAvatar = await Promise.all(admins.map(async (admin) => {
            const avatar = await this.imageRepository.findOne({
                where: { id_admin_gestionnaire: admin.id_admin_gestionnaire, motif: image_entity_1.ImageMotifEnum.AVATAR_ADMIN },
            });
            return {
                ...admin,
                avatar_url: avatar ? avatar.url_image : null,
            };
        }));
        return {
            nombre_admins: nombre,
            administrateurs: adminsAvecAvatar,
        };
    }
    async modifierMotDePasseAdmin(id, nouveauMotDePasse) {
        if (!nouveauMotDePasse || nouveauMotDePasse.length < 4) {
            throw new common_1.BadRequestException('Le mot de passe doit contenir au moins 4 caractères.');
        }
        const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
        if (!admin) {
            throw new common_1.NotFoundException("Administrateur non trouvé.");
        }
        const hash = await bcrypt.hash(nouveauMotDePasse, await bcrypt.genSalt());
        admin.mot_de_passe = hash;
        admin.date_modification = new Date();
        await this.adminRepository.save(admin);
        return { message: 'Mot de passe modifié avec succès.' };
    }
    async modifierPermissionsAdmin(id, permissions) {
        const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: id });
        if (!admin) {
            throw new common_1.NotFoundException("Administrateur non trouvé.");
        }
        admin.permissions = permissions;
        admin.date_modification = new Date();
        await this.adminRepository.save(admin);
        return { message: 'Permissions mises à jour avec succès.', permissions };
    }
    async rechercherParRole(role) {
        const admins = await this.adminRepository.find({ where: { role } });
        const adminsAvecAvatar = await Promise.all(admins.map(async (admin) => {
            const avatar = await this.imageRepository.findOne({
                where: { id_admin_gestionnaire: admin.id_admin_gestionnaire, motif: image_entity_1.ImageMotifEnum.AVATAR_ADMIN },
            });
            return {
                ...admin,
                avatar_url: avatar ? avatar.url_image : null,
            };
        }));
        return {
            nombre_resultats: admins.length,
            administrateurs: adminsAvecAvatar,
        };
    }
    async crediterUtilisateur(id_user, montant, idAdmin) {
        let compte = null;
        let admin = null;
        let ancienSolde = null;
        let nouveauSolde = null;
        try {
            if (!id_user || !montant || montant <= 0) {
                throw new common_1.BadRequestException('ID utilisateur et montant requis');
            }
            [compte] = await this.dataSource.query(`SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`, [id_user]);
            if (!compte)
                throw new common_1.NotFoundException('Compte utilisateur introuvable');
            [admin] = await this.dataSource.query(`SELECT * FROM administrateurs WHERE id_admin_gestionnaire = $1 LIMIT 1`, [idAdmin]);
            if (!admin)
                throw new common_1.NotFoundException("Administrateur non trouvé");
            const MAX_AUTORISE = 500000;
            const cumulActuel = parseInt(admin.cumule_des_transactions);
            const soldeActuel = parseInt(admin.solde_de_rechargement);
            const nouveauCumul = cumulActuel + montant;
            const nouveauSoldeAdmin = soldeActuel - montant;
            if (nouveauCumul > MAX_AUTORISE) {
                throw new common_1.BadRequestException("❌ Plafond de 50 000 000 FCFA atteint.");
            }
            if (nouveauSoldeAdmin < 0) {
                throw new common_1.BadRequestException("❌ Solde de rechargement insuffisant.");
            }
            ancienSolde = compte.solde_compte;
            nouveauSolde = compte.solde_compte + montant;
            await this.dataSource.transaction(async (manager) => {
                await manager.query(`UPDATE compte SET solde_compte = $1 WHERE id_compte = $2`, [nouveauSolde, compte.id_compte]);
                await manager.query(`UPDATE administrateurs
         SET cumule_des_transactions = $1,
             solde_de_rechargement = $2,
             date_modification = NOW()
         WHERE id_admin_gestionnaire = $3`, [nouveauCumul, nouveauSoldeAdmin, idAdmin]);
                await manager.query(`
        INSERT INTO admin_rechargements 
        (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde, statut, erreur_operations)
        VALUES ($1, 'user', $2, $3, $4, $5, $6, $7, $8)
      `, [
                    idAdmin,
                    id_user,
                    id_user,
                    montant,
                    ancienSolde,
                    nouveauSolde,
                    'reussie',
                    null
                ]);
            });
            return {
                message: '✅ Solde crédité avec succès',
                utilisateur: id_user,
                montant_crédité: montant,
            };
        }
        catch (error) {
            try {
                await this.dataSource.query(`INSERT INTO admin_rechargements
          (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde, statut, erreur_operations)
         VALUES ($1, 'user', $2, $3, $4, $5, $6, $7, $8)`, [
                    idAdmin,
                    id_user ?? null,
                    id_user ?? null,
                    montant ?? null,
                    compte?.solde_compte ?? null,
                    compte?.solde_compte ?? null,
                    'echouee',
                    error.message,
                ]);
            }
            catch (logError) {
                console.error('Erreur lors de la traçabilité de l\'échec admin:', logError);
            }
            throw error;
        }
    }
    async crediterEtablissement(idEtab, montant, idAdmin) {
        let compte = null;
        let admin = null;
        let ancienSolde = null;
        let nouveauSolde = null;
        try {
            if (!idEtab || !montant || montant <= 0) {
                throw new common_1.BadRequestException('ID établissement et montant requis');
            }
            [compte] = await this.dataSource.query(`SELECT * FROM compte WHERE id_user_etablissement_sante = $1 AND statut = 'actif' LIMIT 1`, [idEtab]);
            if (!compte)
                throw new common_1.NotFoundException("Compte établissement introuvable");
            [admin] = await this.dataSource.query(`SELECT * FROM administrateurs WHERE id_admin_gestionnaire = $1 LIMIT 1`, [idAdmin]);
            if (!admin)
                throw new common_1.NotFoundException("Administrateur non trouvé");
            const MAX_AUTORISE = 500000;
            const cumulActuel = parseInt(admin.cumule_des_transactions);
            const soldeActuel = parseInt(admin.solde_de_rechargement);
            const nouveauCumul = cumulActuel + montant;
            const nouveauSoldeAdmin = soldeActuel - montant;
            if (nouveauCumul > MAX_AUTORISE) {
                throw new common_1.BadRequestException("❌ Plafond de 50 000 000 FCFA atteint.");
            }
            if (nouveauSoldeAdmin < 0) {
                throw new common_1.BadRequestException("❌ Solde de rechargement insuffisant.");
            }
            ancienSolde = compte.solde_compte;
            nouveauSolde = compte.solde_compte + montant;
            await this.dataSource.transaction(async (manager) => {
                await manager.query(`UPDATE compte SET solde_compte = $1 WHERE id_user_etablissement_sante = $2`, [nouveauSolde, idEtab]);
                await manager.query(`UPDATE administrateurs
         SET cumule_des_transactions = $1,
             solde_de_rechargement = $2,
             date_modification = NOW()
         WHERE id_admin_gestionnaire = $3`, [nouveauCumul, nouveauSoldeAdmin, idAdmin]);
                await manager.query(`
        INSERT INTO admin_rechargements 
        (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde, statut, erreur_operations)
        VALUES ($1, 'etablissement', $2, $3, $4, $5, $6, $7, $8)
      `, [
                    idAdmin,
                    idEtab.toString(),
                    idEtab.toString(),
                    montant,
                    ancienSolde,
                    nouveauSolde,
                    'reussie',
                    null
                ]);
            });
            return {
                message: `✅ Crédit de ${montant} XOF effectué avec succès.`,
                nouveauSolde,
                montant_crédité: montant,
            };
        }
        catch (error) {
            try {
                await this.dataSource.query(`INSERT INTO admin_rechargements
          (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde, statut, erreur_operations)
         VALUES ($1, 'etablissement', $2, $3, $4, $5, $6, $7, $8)`, [
                    idAdmin,
                    idEtab?.toString() ?? null,
                    idEtab?.toString() ?? null,
                    montant ?? null,
                    compte?.solde_compte ?? null,
                    compte?.solde_compte ?? null,
                    'echouee',
                    error.message,
                ]);
            }
            catch (logError) {
                console.error('Erreur lors de la traçabilité de l\'échec admin:', logError);
            }
            throw error;
        }
    }
    async retirerUtilisateur(id_user, montant, idAdmin) {
        let compte = null;
        let admin = null;
        let ancienSolde = null;
        let nouveauSolde = 0;
        try {
            if (!id_user || !montant || montant <= 0) {
                throw new common_1.BadRequestException('ID utilisateur et montant requis');
            }
            [compte] = await this.dataSource.query(`SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`, [id_user]);
            if (!compte)
                throw new common_1.NotFoundException('Compte utilisateur introuvable');
            if (compte.solde_compte < montant) {
                throw new common_1.BadRequestException("❌ Solde utilisateur insuffisant pour ce retrait.");
            }
            [admin] = await this.dataSource.query(`SELECT * FROM administrateurs WHERE id_admin_gestionnaire = $1 LIMIT 1`, [idAdmin]);
            if (!admin)
                throw new common_1.NotFoundException("Administrateur non trouvé");
            const MAX_AUTORISE = 500000;
            const cumulActuel = parseInt(admin.cumule_des_transactions);
            const soldeActuel = parseInt(admin.solde_de_rechargement);
            const nouveauCumul = cumulActuel + montant;
            const nouveauSoldeAdmin = soldeActuel + montant;
            if (nouveauCumul > MAX_AUTORISE) {
                throw new common_1.BadRequestException("❌ Plafond de 50 000 000 FCFA atteint.");
            }
            ancienSolde = compte.solde_compte;
            nouveauSolde = compte.solde_compte - montant;
            await this.dataSource.transaction(async (manager) => {
                await manager.query(`UPDATE compte SET solde_compte = $1 WHERE id_compte = $2`, [nouveauSolde, compte.id_compte]);
                await manager.query(`UPDATE administrateurs
         SET cumule_des_transactions = $1,
             solde_de_rechargement = $2,
             date_modification = NOW()
         WHERE id_admin_gestionnaire = $3`, [nouveauCumul, nouveauSoldeAdmin, idAdmin]);
                const montantNegatif = -Math.abs(montant);
                await manager.query(`
        INSERT INTO admin_rechargements 
        (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde, statut, erreur_operations, type_operation)
        VALUES ($1, 'user', $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
                    idAdmin,
                    id_user,
                    id_user,
                    montantNegatif,
                    ancienSolde,
                    nouveauSolde,
                    'reussie',
                    'retrait',
                    null
                ]);
            });
            return {
                message: '✅ Retrait effectué avec succès depuis le compte utilisateur',
                utilisateur: id_user,
                montant_retiré: montant,
            };
        }
        catch (error) {
            try {
                await this.dataSource.query(`INSERT INTO admin_rechargements
          (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde, statut, erreur_operations, type_operation)
         VALUES ($1, 'user', $2, $3, $4, $5, $6, $7, $8, $9)`, [
                    idAdmin,
                    id_user ?? null,
                    id_user ?? null,
                    montant ? -Math.abs(montant) : null,
                    compte?.solde_compte ?? null,
                    compte?.solde_compte ?? null,
                    'echouee',
                    error.message,
                    'retrait',
                ]);
            }
            catch (logError) {
                console.error('Erreur lors de la traçabilité de l\'échec admin:', logError);
            }
            throw error;
        }
    }
    async retirerEtablissement(idEtab, montant, idAdmin) {
        let compte = null;
        let admin = null;
        let ancienSolde = null;
        let nouveauSolde = 0;
        try {
            if (!idEtab || !montant || montant <= 0) {
                throw new common_1.BadRequestException('ID établissement et montant requis');
            }
            [compte] = await this.dataSource.query(`SELECT * FROM compte WHERE id_user_etablissement_sante = $1 AND statut = 'actif' LIMIT 1`, [idEtab]);
            if (!compte)
                throw new common_1.NotFoundException("Compte établissement introuvable");
            if (compte.solde_compte < montant) {
                throw new common_1.BadRequestException("❌ Solde insuffisant sur le compte de l’établissement.");
            }
            [admin] = await this.dataSource.query(`SELECT * FROM administrateurs WHERE id_admin_gestionnaire = $1 LIMIT 1`, [idAdmin]);
            if (!admin)
                throw new common_1.NotFoundException("Administrateur non trouvé");
            const MAX_AUTORISE = 500000;
            const cumulActuel = parseInt(admin.cumule_des_transactions);
            const soldeActuel = parseInt(admin.solde_de_rechargement);
            const nouveauCumul = cumulActuel + montant;
            const nouveauSoldeAdmin = soldeActuel + montant;
            if (nouveauCumul > MAX_AUTORISE) {
                throw new common_1.BadRequestException("❌ Plafond de 50 000 000 FCFA atteint.");
            }
            ancienSolde = compte.solde_compte;
            nouveauSolde = compte.solde_compte - montant;
            await this.dataSource.transaction(async (manager) => {
                await manager.query(`UPDATE compte SET solde_compte = $1 WHERE id_user_etablissement_sante = $2`, [nouveauSolde, idEtab]);
                await manager.query(`UPDATE administrateurs
         SET cumule_des_transactions = $1,
             solde_de_rechargement = $2,
             date_modification = NOW()
         WHERE id_admin_gestionnaire = $3`, [nouveauCumul, nouveauSoldeAdmin, idAdmin]);
                const montantNegatif = -Math.abs(montant);
                await manager.query(`
        INSERT INTO admin_rechargements 
        (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde, statut, erreur_operations, type_operation)
        VALUES ($1, 'etablissement', $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
                    idAdmin,
                    idEtab.toString(),
                    idEtab.toString(),
                    montantNegatif,
                    ancienSolde,
                    nouveauSolde,
                    'reussie',
                    'retrait',
                    null
                ]);
            });
            return {
                message: `✅ Retrait de ${montant} XOF effectué avec succès depuis l’établissement.`,
                nouveauSolde,
                montant_retiré: montant,
            };
        }
        catch (error) {
            try {
                await this.dataSource.query(`INSERT INTO admin_rechargements
          (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde, statut, erreur_operations, type_operation)
         VALUES ($1, 'etablissement', $2, $3, $4, $5, $6, $7, $8, $9)`, [
                    idAdmin,
                    idEtab?.toString() ?? null,
                    idEtab?.toString() ?? null,
                    montant ? -Math.abs(montant) : null,
                    compte?.solde_compte ?? null,
                    compte?.solde_compte ?? null,
                    'echouee',
                    error.message,
                    'retrait',
                ]);
            }
            catch (logError) {
                console.error('Erreur lors de la traçabilité de l\'échec admin:', logError);
            }
            throw error;
        }
    }
    async findAllEtablissements() {
        const etabs = await this.dataSource.query(`SELECT * FROM user_etablissement_sante ORDER BY id_user_etablissement_sante DESC`);
        const etablissements = await Promise.all(etabs.map(async (etab) => {
            const [compte] = await this.dataSource.query(`SELECT * FROM compte WHERE id_user_etablissement_sante = $1 LIMIT 1`, [etab.id_user_etablissement_sante]);
            const [qrStatique] = await this.dataSource.query(`SELECT * FROM qr_code_paiement_statique WHERE id_user_etablissement_sante = $1 LIMIT 1`, [etab.id_user_etablissement_sante]);
            const [qrDynamique] = await this.dataSource.query(`SELECT * FROM qr_code_paiement_dynamique 
           WHERE id_user_etablissement_sante = $1 AND statut = 'actif' 
           AND date_expiration > NOW() 
           ORDER BY date_creation DESC LIMIT 1`, [etab.id_user_etablissement_sante]);
            const [image] = await this.dataSource.query(`SELECT url_image FROM images 
           WHERE id_user_etablissement_sante = $1 
           AND motif = 'photo_profile' LIMIT 1`, [etab.id_user_etablissement_sante]);
            return {
                ...etab,
                image_profil: image?.url_image || null,
                compte: compte || null,
                qr_code_statique: qrStatique || null,
                qr_code_dynamique: qrDynamique || null,
            };
        }));
        return {
            total: etablissements.length,
            etablissements,
        };
    }
    async rechargerUser(identifiant, montant, idAdmin) {
        let user = null;
        let compte = null;
        let admin = null;
        let ancienSolde = null;
        let nouveauSoldeUser = null;
        try {
            [user] = await this.dataSource.query(`SELECT * FROM utilisateur WHERE email = $1 OR telephone = $1 LIMIT 1`, [identifiant]);
            if (!user)
                throw new common_1.NotFoundException("Utilisateur introuvable");
            [compte] = await this.dataSource.query(`SELECT * FROM compte WHERE id_user = $1 LIMIT 1`, [user.id_user]);
            if (!compte)
                throw new common_1.NotFoundException("Compte utilisateur introuvable");
            [admin] = await this.dataSource.query(`SELECT * FROM administrateurs WHERE id_admin_gestionnaire = $1 LIMIT 1`, [idAdmin]);
            if (!admin)
                throw new common_1.NotFoundException("Administrateur non trouvé");
            const MAX_AUTORISE = 500000;
            const cumulActuel = parseInt(admin.cumule_des_transactions);
            const soldeActuel = parseInt(admin.solde_de_rechargement);
            const nouveauCumul = cumulActuel + montant;
            const nouveauSoldeAdmin = soldeActuel - montant;
            if (nouveauCumul > MAX_AUTORISE) {
                throw new common_1.BadRequestException("❌ Plafond de 50 000 000 FCFA atteint.");
            }
            if (nouveauSoldeAdmin < 0) {
                throw new common_1.BadRequestException("❌ Solde de rechargement insuffisant.");
            }
            ancienSolde = compte.solde_compte;
            nouveauSoldeUser = compte.solde_compte + montant;
            await this.dataSource.transaction(async (manager) => {
                await manager.query(`UPDATE compte SET solde_compte = $1 WHERE id_user = $2`, [nouveauSoldeUser, user.id_user]);
                await manager.query(`UPDATE administrateurs
         SET cumule_des_transactions = $1,
             solde_de_rechargement = $2,
             date_modification = NOW()
         WHERE id_admin_gestionnaire = $3`, [nouveauCumul, nouveauSoldeAdmin, idAdmin]);
                await manager.query(`INSERT INTO admin_rechargements (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde, statut, erreur_operations, type_operation)
         VALUES ($1, 'user', $2, $3, $4, $5, $6, $7, $8, $9)`, [idAdmin, user.id_user, identifiant, montant, ancienSolde, nouveauSoldeUser, 'reussie', null, 'dépot',]);
            });
            return {
                message: '✅ Rechargement utilisateur effectué avec succès',
                nouveauSolde: nouveauSoldeUser,
                montant_crédité: montant
            };
        }
        catch (error) {
            try {
                await this.dataSource.query(`INSERT INTO admin_rechargements
          (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde, statut, erreur_operations, type_operation)
         VALUES ($1, 'user', $2, $3, $4, $5, $6, $7, $8, $9)`, [
                    idAdmin,
                    user?.id_user ?? null,
                    identifiant ?? null,
                    montant ?? null,
                    compte?.solde_compte ?? null,
                    compte?.solde_compte ?? null,
                    'echouee',
                    error.message,
                    'dépot',
                ]);
            }
            catch (logError) {
                console.error('Erreur lors de la traçabilité de l\'échec rechargerUser:', logError);
            }
            throw error;
        }
    }
    async rechargerEtablissement(identifiant, montant, idAdmin) {
        let etab = null;
        let compte = null;
        let admin = null;
        let ancienSolde = null;
        let nouveauSoldeEtab = null;
        try {
            [etab] = await this.dataSource.query(`SELECT * FROM user_etablissement_sante WHERE email = $1 OR telephone = $1 LIMIT 1`, [identifiant]);
            if (!etab)
                throw new common_1.NotFoundException("Établissement introuvable");
            [compte] = await this.dataSource.query(`SELECT * FROM compte WHERE id_user_etablissement_sante = $1 LIMIT 1`, [etab.id_user_etablissement_sante]);
            if (!compte)
                throw new common_1.NotFoundException("Compte établissement introuvable");
            [admin] = await this.dataSource.query(`SELECT * FROM administrateurs WHERE id_admin_gestionnaire = $1 LIMIT 1`, [idAdmin]);
            if (!admin)
                throw new common_1.NotFoundException("Administrateur non trouvé");
            const MAX_AUTORISE = 500000;
            const cumulActuel = parseInt(admin.cumule_des_transactions);
            const soldeActuel = parseInt(admin.solde_de_rechargement);
            const nouveauCumul = cumulActuel + montant;
            const nouveauSoldeAdmin = soldeActuel - montant;
            if (nouveauCumul > MAX_AUTORISE) {
                throw new common_1.BadRequestException("❌ Plafond de 50 000 000 FCFA atteint.");
            }
            if (nouveauSoldeAdmin < 0) {
                throw new common_1.BadRequestException("❌ Solde de rechargement insuffisant.");
            }
            ancienSolde = compte.solde_compte;
            nouveauSoldeEtab = compte.solde_compte + montant;
            await this.dataSource.transaction(async (manager) => {
                await manager.query(`UPDATE compte SET solde_compte = $1 WHERE id_user_etablissement_sante = $2`, [nouveauSoldeEtab, etab.id_user_etablissement_sante]);
                await manager.query(`UPDATE administrateurs
         SET cumule_des_transactions = $1,
             solde_de_rechargement = $2,
             date_modification = NOW()
         WHERE id_admin_gestionnaire = $3`, [nouveauCumul, nouveauSoldeAdmin, idAdmin]);
                await manager.query(`INSERT INTO admin_rechargements (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde, statut, erreur_operations, type_operation)
         VALUES ($1, 'etablissement', $2, $3, $4, $5, $6, $7, $8, $9)`, [
                    idAdmin,
                    etab.id_user_etablissement_sante,
                    identifiant,
                    montant,
                    ancienSolde,
                    nouveauSoldeEtab,
                    'reussie',
                    'dépot',
                    null
                ]);
            });
            return {
                message: '✅ Rechargement établissement effectué avec succès',
                nouveauSolde: nouveauSoldeEtab,
                montant_crédité: montant
            };
        }
        catch (error) {
            try {
                await this.dataSource.query(`INSERT INTO admin_rechargements
          (id_admin, cible_type, cible_id, identifiant, montant, ancien_solde, nouveau_solde, statut, erreur_operations, type_operation)
         VALUES ($1, 'etablissement', $2, $3, $4, $5, $6, $7, $8, $9)`, [
                    idAdmin,
                    etab?.id_user_etablissement_sante ?? null,
                    identifiant ?? null,
                    montant ?? null,
                    compte?.solde_compte ?? null,
                    compte?.solde_compte ?? null,
                    'echouee',
                    error.message,
                    'dépot',
                ]);
            }
            catch (logError) {
                console.error('Erreur lors de la traçabilité de l\'échec rechargerEtablissement:', logError);
            }
            throw error;
        }
    }
    async getAllRechargements() {
        return await this.dataSource.query(`SELECT * FROM admin_rechargements ORDER BY date DESC`);
    }
    async getTotalFraisTransactions() {
        const result = await this.dataSource.query(`
      SELECT COALESCE(SUM(montant_frais), 0) AS total_frais
      FROM transactions_frais
    `);
        return { total_frais: parseInt(result[0].total_frais, 10) };
    }
    async findUser(identifiant, type) {
        if (!identifiant || !type)
            throw new common_1.BadRequestException('Identifiant et type requis');
        let user;
        switch (type.toLowerCase()) {
            case 'email':
                [user] = await this.dataSource.query(`SELECT * FROM utilisateur WHERE email = $1 LIMIT 1`, [identifiant]);
                break;
            case 'uuid':
                [user] = await this.dataSource.query(`SELECT * FROM utilisateur WHERE id_user = $1 LIMIT 1`, [identifiant]);
                break;
            case 'numéro de téléphone':
            case 'téléphone':
            case 'telephone':
                [user] = await this.dataSource.query(`SELECT * FROM utilisateur WHERE telephone = $1 LIMIT 1`, [identifiant]);
                break;
            default:
                throw new common_1.BadRequestException('Type de recherche non supporté');
        }
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        const [compte] = await this.dataSource.query(`SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`, [user.id_user]);
        return {
            utilisateur: {
                id: user.id_user,
                email: user.email,
                telephone: user.telephone,
                nom: user.nom,
                image_profil: user.image_profil,
                actif: compte?.statut === 'actif',
                date_inscription: user.date_creation,
            },
        };
    }
    async rechercherUtilisateurParIdentifiant(identifiant, type) {
        if (!identifiant || !type) {
            throw new common_1.BadRequestException('Identifiant et type requis');
        }
        let query = '';
        switch (type.toLowerCase()) {
            case 'email':
                query = `SELECT * FROM utilisateur WHERE email = $1 LIMIT 1`;
                break;
            case 'numéro de téléphone':
            case 'numero de téléphone':
            case 'téléphone':
            case 'telephone':
                query = `SELECT * FROM utilisateur WHERE telephone = $1 LIMIT 1`;
                break;
            case 'uuid':
                query = `SELECT * FROM utilisateur WHERE id_user = $1 LIMIT 1`;
                break;
            default:
                throw new common_1.BadRequestException('Type de recherche non valide');
        }
        const [user] = await this.dataSource.query(query, [identifiant]);
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        return user;
    }
    async verifierEtMettreAJourAdminTransaction(idAdmin, montant) {
        const admin = await this.adminRepository.findOneBy({ id_admin_gestionnaire: idAdmin });
        if (!admin)
            throw new common_1.NotFoundException("Administrateur non trouvé");
        const MAX_AUTORISE = 500000;
        const nouveauCumul = admin.cumule_des_transactions + montant;
        if (nouveauCumul > MAX_AUTORISE) {
            throw new common_1.BadRequestException("❌ Plafond de 50 000 000 FCFA atteint. Vous ne pouvez plus effectuer de transaction.");
        }
        if (admin.solde_de_rechargement < montant) {
            throw new common_1.BadRequestException("❌ Solde de rechargement insuffisant.");
        }
        admin.cumule_des_transactions = nouveauCumul;
        admin.solde_de_rechargement -= montant;
        admin.date_modification = new Date();
        await this.adminRepository.save(admin);
    }
};
exports.AdministrateurService = AdministrateurService;
__decorate([
    (0, common_1.Get)('utilisateur/find'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Query)('identifiant')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdministrateurService.prototype, "findUser", null);
exports.AdministrateurService = AdministrateurService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(administrateur_entity_1.Administrateur)),
    __param(2, (0, common_1.Inject)('CLOUDINARY')),
    __param(3, (0, typeorm_1.InjectRepository)(image_entity_1.Image)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService, Object, typeorm_2.Repository,
        typeorm_3.DataSource])
], AdministrateurService);
//# sourceMappingURL=administrateur.service.js.map