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
exports.GestUtilisateurService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../utilisateur/entities/user.entity");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_3 = require("typeorm");
let GestUtilisateurService = class GestUtilisateurService {
    constructor(userRepository, dataSource) {
        this.userRepository = userRepository;
        this.dataSource = dataSource;
    }
    async checkUserExistence(identifier) {
        const user = await this.userRepository.findOne({
            where: [{ email: identifier }, { telephone: identifier }],
        });
        return !!user;
    }
    async findAll() {
        const users = await this.userRepository.find({
            relations: ['images'],
        });
        const utilisateurs = await Promise.all(users.map(async (user) => {
            const [compte] = await this.dataSource.query(`SELECT * FROM compte WHERE id_user = $1 LIMIT 1`, [user.id_user]);
            const [qrStatique] = await this.dataSource.query(`SELECT * FROM qr_code_paiement_statique WHERE id_user = $1 LIMIT 1`, [user.id_user]);
            const [qrDynamique] = await this.dataSource.query(`SELECT * FROM qr_code_paiement_dynamique 
           WHERE id_user = $1 AND statut = 'actif' AND date_expiration > NOW() 
           ORDER BY date_creation DESC LIMIT 1`, [user.id_user]);
            return {
                ...user,
                image_profil: user.images?.find(img => img.motif === 'photo_profile')?.url_image || null,
                images: undefined,
                compte: compte || null,
                qr_code_statique: qrStatique || null,
                qr_code_dynamique: qrDynamique || null,
            };
        }));
        return {
            total: utilisateurs.length,
            utilisateurs,
        };
    }
    async findOne(id_user) {
        const user = await this.userRepository.findOne({
            where: { id_user },
            relations: ['images'],
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé.');
        }
        const image_profil = user.images?.find(img => img.motif === 'photo_profile')?.url_image || null;
        const { images, ...userSansImages } = user;
        return {
            ...userSansImages,
            image_profil,
        };
    }
    async updateBanReason(id_user, updateUserDto) {
        const { raison_banni } = updateUserDto;
        if (!raison_banni) {
            throw new common_1.BadRequestException('La raison du bannissement est requise.');
        }
        await this.userRepository.update(id_user, { raison_banni });
        return this.findOne(id_user);
    }
    async remove(id_user) {
        await this.userRepository.delete(id_user);
    }
    async updateActivation(id_user, activationUserDto) {
        const { actif } = activationUserDto;
        const user = await this.userRepository.findOne({ where: { id_user } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé.');
        }
        user.actif = actif;
        await this.userRepository.save(user);
        return user;
    }
    async resetPassword(id_user, resetPasswordDto) {
        const { nouveau_mot_de_passe } = resetPasswordDto;
        const user = await this.userRepository.findOne({ where: { id_user } });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé.');
        }
        const hashedPassword = await bcrypt.hash(nouveau_mot_de_passe, 10);
        user.mdp = hashedPassword;
        await this.userRepository.save(user);
        return { message: 'Mot de passe réinitialisé avec succès.' };
    }
};
exports.GestUtilisateurService = GestUtilisateurService;
exports.GestUtilisateurService = GestUtilisateurService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_3.DataSource])
], GestUtilisateurService);
//# sourceMappingURL=gest_utilisateur.service.js.map