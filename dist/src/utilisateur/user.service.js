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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("./entities/user.entity");
const image_entity_1 = require("../image/entities/image.entity");
const image_entity_2 = require("../image/entities/image.entity");
const image_service_1 = require("../image/image.service");
const compte_service_1 = require("../compte/compte.service");
const qr_code_service_1 = require("../qr-code/qr-code.service");
const otp_entity_1 = require("./entities/otp.entity");
const email_service_1 = require("./email.service");
const sms_service_1 = require("./sms.service");
let UserService = class UserService {
    constructor(userRepository, imageRepository, imageService, compteService, qrCodeService, otpRepository, emailService, smsService, utilisateurRepo) {
        this.userRepository = userRepository;
        this.imageRepository = imageRepository;
        this.imageService = imageService;
        this.compteService = compteService;
        this.qrCodeService = qrCodeService;
        this.otpRepository = otpRepository;
        this.emailService = emailService;
        this.smsService = smsService;
        this.utilisateurRepo = utilisateurRepo;
    }
    async registerUser(identifier, code_invitation_utilise) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: [{ email: identifier }, { telephone: identifier }],
            });
            if (existingUser) {
                return {
                    success: false,
                    message: existingUser.email === identifier
                        ? `L'email ${identifier} est déjà utilisé.`
                        : `Le numéro ${identifier} est déjà utilisé.`
                };
            }
            const newUser = this.userRepository.create({
                email: identifier.includes('@') ? identifier : undefined,
                telephone: identifier.includes('@') ? undefined : identifier,
                code_confirmation: Math.floor(1000 + Math.random() * 9000).toString(),
                date_inscription: new Date(),
                code_invitation_utilise: code_invitation_utilise ?? null
            });
            const savedUser = await this.userRepository.save(newUser);
            await this.compteService.createUserCompte(savedUser.id_user);
            await this.qrCodeService.createStaticQrForNewUser(savedUser.id_user);
            await this.qrCodeService.createDynamicQrForUser(savedUser.id_user);
            return { success: true, id_user: savedUser.id_user, message: "Utilisateur inscrit, redirection vers la définition du mot de passe." };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Erreur lors de l'inscription: " + error.message);
        }
    }
    async setUserPassword(identifier, password) {
        if (!password.trim()) {
            return { success: false, message: "Le mot de passe ne peut pas être vide." };
        }
        const user = await this.userRepository.findOne({
            where: [{ email: identifier }, { telephone: identifier }],
        });
        if (!user) {
            throw new common_1.BadRequestException(`L'identifiant ${identifier} est incorrect.`);
        }
        user.mdp = await bcrypt.hash(password.trim(), 10);
        await this.userRepository.save(user);
        return { success: true, message: "Mot de passe défini avec succès." };
    }
    async getUserById(id_user) {
        const user = await this.userRepository.findOne({ where: { id_user } });
        if (!user) {
            throw new common_1.NotFoundException("Utilisateur introuvable");
        }
        const profileImage = await this.imageRepository.findOne({
            where: { id_user, motif: image_entity_2.ImageMotifEnum.PROFILE },
            order: { date: 'DESC' }
        });
        const compte = await this.compteService.getUserCompte(id_user);
        const qrcodedynamique = await this.qrCodeService.getUserDynamicQrCodes(id_user);
        const qrcodedstatique = await this.qrCodeService.getUserStaticQrCode(id_user);
        const allqrcodes = await this.qrCodeService.getAllUserQrCodes(id_user);
        return {
            ...user,
            mdp: user.mdp,
            photo_profile: profileImage ? profileImage.url_image : 'https://res.cloudinary.com/dhrrk7vsd/image/upload/v1745581355/hostolink/default_icone_pyiudn.png',
            compte,
            qrcodedynamique,
            qrcodedstatique,
            allqrcodes,
        };
    }
    async generateOtp(identifier, moyen_envoyer) {
        try {
            identifier = identifier.trim();
            const user = await this.userRepository.findOne({
                where: [{ email: identifier }, { telephone: identifier }],
            });
            if (!user || !user.id_user) {
                console.error(`❌ Échec : Utilisateur invalide ou introuvable pour ${identifier}`);
                throw new common_1.BadRequestException("Utilisateur invalide ou introuvable");
            }
            const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 5);
            const otp = this.otpRepository.create({
                otp_code: otpCode,
                expires_at: expirationDate,
                is_valid: true,
                moyen_envoyer,
                user,
                id_user_etablissement_sante: undefined,
            });
            await this.otpRepository.save(otp);
            await this.otpRepository.createQueryBuilder()
                .delete()
                .from(otp_entity_1.Otp)
                .where("id_user = :id_user AND otp_code != :code", {
                id_user: user.id_user,
                code: otpCode,
            })
                .execute();
            if (moyen_envoyer === otp_entity_1.MoyenEnvoiEnum.EMAIL) {
                if (!user.email) {
                    throw new common_1.BadRequestException("Impossible d'envoyer l'OTP : aucun email renseigné.");
                }
                await this.emailService.sendOtpEmail(user.email, otpCode);
            }
            if (moyen_envoyer === otp_entity_1.MoyenEnvoiEnum.SMS) {
                if (!user.telephone) {
                    throw new common_1.BadRequestException("Impossible d'envoyer l'OTP : aucun numéro de téléphone renseigné.");
                }
                console.log(`une erreur s'es produit lors 📲 SMS à envoyé ${user.telephone} avec OTP ${otpCode}`);
            }
            return { success: true, otp: otpCode };
        }
        catch (error) {
            console.error("❌ Erreur dans generateOtp :", error);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException("Erreur lors de la génération de l'OTP");
        }
    }
    async generateJwtToken(user) {
        return this.AuthService.sign({
            id_user: user.id_user,
            email: user.email,
            telephone: user.telephone,
        });
    }
    async verifyOtp(identifier, otpCode) {
        try {
            identifier = identifier.trim();
            otpCode = otpCode.trim();
            const user = await this.userRepository.findOne({
                where: [{ email: identifier }, { telephone: identifier }],
            });
            if (!user) {
                console.warn(`❌ Utilisateur non trouvé pour ${identifier}`);
                return { success: false, message: "Utilisateur non trouvé" };
            }
            const otp = await this.otpRepository.findOne({
                where: {
                    user: { id_user: user.id_user },
                    otp_code: otpCode,
                    is_valid: true
                },
                relations: ['user'],
            });
            if (!otp) {
                console.warn(`❌ Aucun OTP valide trouvé pour ${identifier} avec code ${otpCode}`);
                return { success: false, message: "Code OTP incorrect ou expiré" };
            }
            if (!user.compte_verifier) {
                user.compte_verifier = true;
                await this.userRepository.save(user);
            }
            if (new Date() > otp.expires_at) {
                otp.is_valid = false;
                await this.otpRepository.save(otp);
                console.warn(`❌ Code OTP expiré pour ${identifier}`);
                return { success: false, message: "Code OTP expiré" };
            }
            otp.is_valid = false;
            await this.otpRepository.save(otp);
            return { success: true, message: "Code OTP valide" };
        }
        catch (error) {
            console.error("❌ Erreur lors de la vérification de l'OTP :", error);
            throw new common_1.InternalServerErrorException("Erreur lors de la vérification de l'OTP");
        }
    }
    async updateUserProfile(id_user, updateProfileDto, file) {
        const user = await this.userRepository.findOne({ where: { id_user } });
        if (!user) {
            throw new common_1.NotFoundException("Utilisateur introuvable.");
        }
        if (!Object.keys(updateProfileDto).length && !file) {
            throw new common_1.BadRequestException("Aucune donnée à mettre à jour.");
        }
        let profileImageUrl = null;
        if (file) {
            const uploadedImage = await this.imageService.uploadImage(file, id_user, image_entity_2.ImageMotifEnum.PROFILE);
            profileImageUrl = uploadedImage?.url_image ?? null;
        }
        await this.userRepository.update(id_user, updateProfileDto);
        return {
            success: true,
            message: "Profil mis à jour avec succès."
        };
    }
    async findUserByIdentifier(identifier) {
        return await this.userRepository.findOne({
            where: [{ email: identifier }, { telephone: identifier }],
        });
    }
    async verifyConfirmationCode(identifier, code) {
        identifier = identifier.trim();
        code = code.trim();
        const user = await this.userRepository.findOne({
            where: [{ email: identifier }, { telephone: identifier }],
        });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        user.compte_verifier = true;
        await this.userRepository.save(user);
        return true;
    }
    async updateUserVerificationStatus(identifier) {
        const user = await this.userRepository.findOne({
            where: [{ email: identifier }, { telephone: identifier }],
        });
        if (user) {
            user.compte_verifier = true;
            await this.userRepository.save(user);
        }
    }
    async verifyUserPin(identifier, pin) {
        identifier = identifier.trim();
        pin = pin.trim();
        const user = await this.userRepository.findOne({
            where: [{ email: identifier }, { telephone: identifier }],
        });
        if (!user || !user.mdp) {
            console.warn(`⚠️ Échec de la vérification PIN : utilisateur introuvable ou mot de passe manquant.`);
            return false;
        }
        const isValid = await bcrypt.compare(pin, user.mdp);
        if (isValid) {
        }
        else {
            console.warn(`❌ PIN incorrect pour ${identifier}`);
        }
        return isValid;
    }
    async generateAndSendOtp(user) {
        const identifier = user.email ?? user.telephone;
        const moyen = user.email ? otp_entity_1.MoyenEnvoiEnum.EMAIL : otp_entity_1.MoyenEnvoiEnum.SMS;
        await this.generateOtp(identifier, moyen);
    }
    async findUserByPhone(telephone) {
        const user = await this.userRepository.findOne({
            where: { telephone, compte_verifier: true, actif: true }
        });
        if (!user) {
            throw new common_1.NotFoundException(`Aucun utilisateur trouvé avec le numéro ${telephone}`);
        }
        return user;
    }
    async verifyOtpAndRewardParrain(identifier, otpCode) {
        try {
            const user = await this.userRepository.findOne({
                where: [{ email: identifier }, { telephone: identifier }],
            });
            if (!user) {
                return { success: false, message: "Utilisateur non trouvé" };
            }
            const otp = await this.otpRepository.findOne({
                where: {
                    user: { id_user: user.id_user },
                    otp_code: otpCode,
                    is_valid: true
                },
                relations: ['user'],
            });
            if (!otp) {
                return { success: false, message: "Code OTP incorrect ou expiré" };
            }
            if (new Date() > otp.expires_at) {
                otp.is_valid = false;
                await this.otpRepository.save(otp);
                return { success: false, message: "Code OTP expiré" };
            }
            if (!user.compte_verifier) {
                user.compte_verifier = true;
                await this.userRepository.save(user);
            }
            otp.is_valid = false;
            await this.otpRepository.save(otp);
            return { success: true, message: "OTP vérifié et bonus parrain appliqué si existant." };
        }
        catch (error) {
            console.error("❌ Erreur verifyOtpAndRewardParrain:", error);
            throw new common_1.InternalServerErrorException("Erreur OTP + bonus");
        }
    }
    async getAllEmails() {
        const users = await this.userRepository.find({
            select: ['email'],
            where: { actif: true, compte_verifier: true },
        });
        return users
            .filter(user => user.email)
            .map(user => user.email);
    }
    async getAllTelephones() {
        const users = await this.userRepository.find({
            select: ['telephone'],
            where: { actif: true, compte_verifier: true },
        });
        return users
            .filter(user => user.telephone)
            .map(user => user.telephone);
    }
    async updateFcmToken(id_user, fcm_token) {
        const user = await this.utilisateurRepo.findOne({ where: { id_user } });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        user.fcm_token = fcm_token;
        await this.utilisateurRepo.save(user);
        return {
            success: true,
            message: 'FCM token mis à jour',
        };
    }
    async createFullUser(data) {
        try {
            const existing = await this.userRepository.findOne({
                where: [
                    { email: data.email ?? '' },
                    { telephone: data.telephone ?? '' }
                ]
            });
            if (existing) {
                return { success: false, message: "Email ou téléphone déjà utilisé." };
            }
            const hashedPassword = await bcrypt.hash(data.mdp, 10);
            const user = this.userRepository.create({
                email: data.email,
                telephone: data.telephone,
                mdp: hashedPassword,
                nom: data.nom,
                prenom: data.prenom,
                pays: data.pays,
                position: data.position
                    ? {
                        type: 'Point',
                        coordinates: [
                            parseFloat(data.position.longitude.toString()),
                            parseFloat(data.position.latitude.toString())
                        ]
                    }
                    : undefined,
                fcm_token: data.fcm_token,
                code_invitation_utilise: data.code_invitation_utilise,
                date_inscription: new Date(),
                compte_verifier: false,
                actif: true,
            });
            const saved = await this.userRepository.save(user);
            await this.compteService.createUserCompte(saved.id_user);
            await this.qrCodeService.createStaticQrForNewUser(saved.id_user);
            return { success: true, id_user: saved.id_user, message: "Utilisateur créé avec succès." };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Erreur lors de la création du compte: " + error.message);
        }
    }
    async getLastOtpByIdentifier(identifier) {
        const user = await this.userRepository.findOne({
            where: [{ email: identifier }, { telephone: identifier }],
        });
        if (!user) {
            return { success: false, message: "Utilisateur non trouvé" };
        }
        const otp = await this.otpRepository.findOne({
            where: { user: { id_user: user.id_user }, is_valid: true },
        });
        if (!otp) {
            return { success: false, message: "Aucun OTP valide trouvé ! Veuillez Réessayer" };
        }
        return {
            success: true,
            otp: otp.otp_code,
            expires_at: otp.expires_at,
            message: "OTP récupéré avec succès"
        };
    }
    async findUserById(id_user) {
        return this.userRepository.findOne({ where: { id_user } });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(image_entity_1.Image)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => image_service_1.ImageService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => compte_service_1.CompteService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => qr_code_service_1.QrCodeService))),
    __param(5, (0, typeorm_1.InjectRepository)(otp_entity_1.Otp)),
    __param(8, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        image_service_1.ImageService,
        compte_service_1.CompteService,
        qr_code_service_1.QrCodeService,
        typeorm_2.Repository,
        email_service_1.EmailService,
        sms_service_1.SmsService,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map