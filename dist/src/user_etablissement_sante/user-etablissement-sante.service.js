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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEtablissementSanteService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_etablissement_sante_entity_1 = require("./entities/user-etablissement-sante.entity");
const code_verif_otp_entity_1 = require("./entities/code-verif-otp.entity");
const raison_suppression_entity_1 = require("./entities/raison-suppression.entity");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const buffer_to_stream_1 = __importDefault(require("buffer-to-stream"));
const image_entity_1 = require("../image/entities/image.entity");
const email_service_1 = require("../utilisateur/email.service");
let UserEtablissementSanteService = class UserEtablissementSanteService {
    logout(token) {
        this.revokedTokens.add(token);
        return { message: 'Déconnexion réussie.' };
    }
    isTokenRevoked(token) {
        return this.revokedTokens.has(token);
    }
    constructor(dataSource, userRepo, otpRepo, raisonRepo, userEtablissementRepo, imageRepo, emailService) {
        this.dataSource = dataSource;
        this.userRepo = userRepo;
        this.otpRepo = otpRepo;
        this.raisonRepo = raisonRepo;
        this.userEtablissementRepo = userEtablissementRepo;
        this.imageRepo = imageRepo;
        this.emailService = emailService;
        this.revokedTokens = new Set();
    }
    async register(data) {
        const exist = await this.userRepo.findOne({ where: { email: data.email } });
        const exist_numb = await this.userRepo.findOne({ where: { telephone: data.telephone } });
        if (exist)
            throw new common_1.BadRequestException('Email déjà utilisé');
        if (exist_numb)
            throw new common_1.BadRequestException('Téléphone déjà utilisé');
        const hash = await bcrypt.hash(data.mot_de_passe, 10);
        const newUser = this.userRepo.create({
            ...data,
            mot_de_passe: hash,
        });
        const savedUser = await this.userRepo.save(newUser);
        await this.generateOtp(savedUser);
        return {
            message: 'Inscription réussie. Un code OTP a été envoyé.',
        };
    }
    async generateOtp(user) {
        const now = new Date();
        const recent = await this.otpRepo.find({
            where: { userEtablissementSante: { id_user_etablissement_sante: user.id_user_etablissement_sante } },
            order: { expires_at: 'DESC' },
            take: 5,
        });
        if (recent.length > 0) {
            const last = recent[0];
            const diff = (now.getTime() - last.expires_at.getTime()) / 1000;
            if (diff < 60)
                throw new common_1.BadRequestException("Veuillez attendre 1 minute avant de redemander un code.");
            const within10min = recent.filter((otp) => (now.getTime() - otp.expires_at.getTime()) / 60_000 < 10);
            if (within10min.length >= 5)
                throw new common_1.BadRequestException("Trop de tentatives. Veuillez réessayer dans 10 minutes.");
        }
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        const otp = this.otpRepo.create({
            otp_code: otpCode,
            expires_at: new Date(now.getTime() + 5 * 60 * 1000),
            userEtablissementSante: user,
            is_valid: true,
        });
        await this.otpRepo.save(otp);
        await this.emailService.sendOtpEmail(user.email, otpCode);
    }
    async verifyOtp(email, code) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user)
            throw new common_1.BadRequestException('Utilisateur non trouvé');
        const otp = await this.otpRepo.findOne({
            where: {
                userEtablissementSante: { id_user_etablissement_sante: user.id_user_etablissement_sante },
                otp_code: code,
                is_valid: true,
            },
        });
        if (!otp)
            throw new common_1.BadRequestException('Code invalide');
        const now = new Date();
        if (otp.expires_at.getTime() < now.getTime()) {
            throw new common_1.BadRequestException('Code expiré');
        }
        otp.is_valid = false;
        await this.otpRepo.save(otp);
        await this.emailService.sendOtpEmail(user.email, otp.otp_code);
        await this.createOrEnsureCompte(user.id_user_etablissement_sante);
        await this.createOrEnsureQrStatique(user.id_user_etablissement_sante);
        await this.createOrEnsureQrDynamique(user.id_user_etablissement_sante);
        await this.createOrReplaceQrDynamique(user.id_user_etablissement_sante);
        return {
            message: 'Code OTP vérifié avec succès',
            user: {
                id: user.id_user_etablissement_sante,
                nom: user.nom,
                email: user.email,
                categorie: user.categorie,
            },
        };
    }
    async createOrEnsureCompte(idEtab) {
        const existing = await this.dataSource.query('SELECT * FROM compte WHERE id_user_etablissement_sante = $1', [idEtab]);
        if (existing.length > 0)
            return;
        const numero_compte = `HST-${idEtab}-${Date.now()}`;
        await this.dataSource.query(`INSERT INTO compte (solde_compte, solde_bonus, cumule_mensuel, plafond, mode_paiement_preferentiel, type_user, devise, numero_compte, statut, id_user_etablissement_sante)
      VALUES (0, 0, 0, 0, NULL, 'etablissement', 'XOF', $1, 'actif', $2)`, [numero_compte, idEtab]);
    }
    async createOrEnsureQrStatique(idEtab) {
        const existing = await this.dataSource.query('SELECT * FROM qr_code_paiement_statique WHERE id_user_etablissement_sante = $1', [idEtab]);
        if (existing.length > 0)
            return;
        const token = this.generateToken();
        const qrData = `HST_STATIC_${idEtab}_${token}`;
        const expiration = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        await this.dataSource.query(`INSERT INTO qr_code_paiement_statique (qr_code_data, statut, token, id_user_etablissement_sante, date_expiration)
     VALUES ($1, 'actif', $2, $3, $4)`, [qrData, token, idEtab, expiration]);
    }
    async createOrEnsureQrDynamique(idEtab) {
        const token = this.generateToken();
        const expiration = new Date(Date.now() + 5 * 60 * 1000);
        await this.dataSource.query(`INSERT INTO qr_code_paiement_dynamique (qr_code_valeur, statut, token, id_user_etablissement_sante, date_expiration)
     VALUES ($1, 'actif', $2, $3, $4)`, [`HST_DYNAMIC_${idEtab}_${token}`, token, idEtab, expiration]);
    }
    generateToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    async getProfile(id) {
        const user = await this.userRepo.findOne({
            where: { id_user_etablissement_sante: id },
            select: {
                id_user_etablissement_sante: true,
                nom: true,
                telephone: true,
                categorie: true,
                adresse: true,
                email: true,
                latitude: true,
                longitude: true,
                specialites: true,
                creatAt: true,
            },
        });
        if (!id || isNaN(id)) {
            throw new common_1.BadRequestException('Identifiant établissement invalide');
        }
        if (!user)
            throw new common_1.BadRequestException('Établissement non trouvé');
        const image = await this.imageRepo.findOne({
            where: {
                id_user_etablissement_sante: id,
                motif: image_entity_1.ImageMotifEnum.PROFILE,
            },
        });
        const [compte] = await this.dataSource.query(`SELECT * FROM compte WHERE id_user_etablissement_sante = $1 LIMIT 1`, [Number(id)]);
        const [qrStatique] = await this.dataSource.query(`SELECT * FROM qr_code_paiement_statique WHERE id_user_etablissement_sante = $1 LIMIT 1`, [Number(id)]);
        const [qrDynamique] = await this.dataSource.query(`SELECT * FROM qr_code_paiement_dynamique 
       WHERE id_user_etablissement_sante = $1 
       AND date_expiration > NOW() 
       ORDER BY date_creation DESC 
       LIMIT 1`, [Number(id)]);
        return {
            ...user,
            image_profil: image ? image.url_image : null,
            compte: compte || null,
            qr_code_statique: qrStatique || null,
            qr_code_dynamique: qrDynamique || null,
        };
    }
    async createOrReplaceQrDynamique(idEtab) {
        await this.dataSource.query(`DELETE FROM qr_code_paiement_dynamique 
       WHERE id_user_etablissement_sante = $1`, [idEtab]);
        const token = this.generateToken();
        const expiration = new Date(Date.now() + 60 * 1000);
        const valeur = `HST_DYNAMIC_${idEtab}_${token}`;
        await this.dataSource.query(`INSERT INTO qr_code_paiement_dynamique (qr_code_valeur, statut, token, id_user_etablissement_sante, date_expiration)
       VALUES ($1, 'actif', $2, $3, $4)`, [valeur, token, idEtab, expiration]);
    }
    async updateProfile(id, dto) {
        const user = await this.userRepo.findOneBy({ id_user_etablissement_sante: id });
        if (!user)
            throw new common_1.NotFoundException("Établissement introuvable");
        Object.assign(user, dto);
        return this.userRepo.save(user);
    }
    async regenerateOtp(identifiant) {
        const user = await this.userRepo.findOne({
            where: [{ email: identifiant }, { telephone: identifiant }],
        });
        if (!user)
            throw new common_1.BadRequestException("Établissement non trouvé");
        await this.generateOtp(user);
        return { message: "Un nouveau code OTP a été généré avec succès." };
    }
    async changePasswordWithOtp(dto) {
        const user = await this.userRepo.findOneBy({ email: dto.email });
        if (!user)
            throw new common_1.NotFoundException("Établissement non trouvé");
        const otp = await this.otpRepo.findOne({
            where: {
                otp_code: dto.otp_code,
                is_valid: true,
                userEtablissementSante: { id_user_etablissement_sante: user.id_user_etablissement_sante },
            },
        });
        if (!otp)
            throw new common_1.BadRequestException("Code OTP invalide");
        if (otp.expires_at.getTime() < new Date().getTime())
            throw new common_1.BadRequestException("Code OTP expiré");
        otp.is_valid = false;
        await this.otpRepo.save(otp);
        await this.emailService.sendOtpEmail(user.email, otp.otp_code);
        user.mot_de_passe = await bcrypt.hash(dto.nouveau_mot_de_passe, 10);
        await this.userRepo.save(user);
        return { message: 'Mot de passe mis à jour avec succès' };
    }
    async deleteAccountWithReason(id, dto) {
        const user = await this.userRepo.findOne({ where: { id_user_etablissement_sante: id } });
        if (!user)
            throw new common_1.BadRequestException("Établissement introuvable");
        const otp = await this.otpRepo.findOne({
            where: {
                userEtablissementSante: { id_user_etablissement_sante: id },
                otp_code: dto.otp_code,
                is_valid: true,
            },
        });
        if (!otp || otp.expires_at.getTime() < Date.now()) {
            throw new common_1.BadRequestException("OTP invalide ou expiré");
        }
        otp.is_valid = false;
        await this.otpRepo.save(otp);
        await this.emailService.sendOtpEmail(user.email, otp.otp_code);
        const raison = this.raisonRepo.create({
            raison: dto.raison,
            userEtablissementSante: user,
        });
        await this.raisonRepo.save(raison);
        await this.userRepo.delete(id);
        return { message: 'Compte supprimé avec succès' };
    }
    async uploadOrUpdateAvatar(idEtablissement, file) {
        const dossier = `dossier_hostolink_preset/${idEtablissement}_user_etablissement_sante`;
        const publicId = `${dossier}/avatar`;
        await cloudinary_1.default.uploader.destroy(publicId);
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.default.uploader.upload_stream({
                folder: dossier,
                public_id: 'avatar',
                overwrite: true,
                resource_type: 'image',
            }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
            (0, buffer_to_stream_1.default)(file.buffer).pipe(uploadStream);
        });
        const uploaded = result;
        const oldImage = await this.imageRepo.findOne({
            where: {
                id_user_etablissement_sante: idEtablissement,
                motif: image_entity_1.ImageMotifEnum.PROFILE,
            },
        });
        if (oldImage) {
            oldImage.url_image = uploaded.secure_url;
            oldImage.date = new Date();
            await this.imageRepo.save(oldImage);
        }
        else {
            const newImage = this.imageRepo.create({
                url_image: uploaded.secure_url,
                motif: image_entity_1.ImageMotifEnum.PROFILE,
                type_user: 'user_etablissement_sante',
                id_user_etablissement_sante: idEtablissement,
            });
            await this.imageRepo.save(newImage);
        }
        return {
            message: 'Image de profil mise à jour avec succès.',
            url: uploaded.secure_url,
        };
    }
    async findLastCreatedEtablissementId() {
        const dernier = await this.userRepo.find({
            order: { creatAt: 'DESC' },
            take: 1,
        });
        return dernier.length ? dernier[0].id_user_etablissement_sante : null;
    }
    async findEtablissementByIdentifier(identifier) {
        return await this.userRepo.findOne({
            where: [{ email: identifier }, { telephone: identifier }],
        });
    }
    async getAllEmailsForEs() {
        const user_etablissement_sante = await this.userRepo.find({
            select: ['email'],
        });
        return user_etablissement_sante
            .filter(user_etablissement => user_etablissement.email)
            .map(user_etablissement => user_etablissement.email);
    }
    async getAllTelephonesForEs() {
        const user_etablissement_sante = await this.userRepo.find({
            select: ['telephone'],
        });
        return user_etablissement_sante
            .filter(user_etablissement => user_etablissement.telephone)
            .map(user_etablissement => user_etablissement.telephone);
    }
};
exports.UserEtablissementSanteService = UserEtablissementSanteService;
exports.UserEtablissementSanteService = UserEtablissementSanteService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_etablissement_sante_entity_1.UserEtablissementSante)),
    __param(2, (0, typeorm_1.InjectRepository)(code_verif_otp_entity_1.CodeVerifOtp)),
    __param(3, (0, typeorm_1.InjectRepository)(raison_suppression_entity_1.RaisonSuppressionCompte)),
    __param(4, (0, typeorm_1.InjectRepository)(user_etablissement_sante_entity_1.UserEtablissementSante)),
    __param(5, (0, typeorm_1.InjectRepository)(image_entity_1.Image)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], UserEtablissementSanteService);
//# sourceMappingURL=user-etablissement-sante.service.js.map