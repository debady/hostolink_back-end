import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEtablissementSante } from './entities/user-etablissement-sante.entity';
import { CodeVerifOtp } from './entities/code-verif-otp.entity';
import { CreateUserEtablissementDto } from './dto/create-user-etablissement.dto';
import { UpdateProfileEtablissementDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { RaisonSuppressionCompte } from './entities/raison-suppression.entity';
import cloudinary from 'src/config/cloudinary';
import toStream = require('buffer-to-stream');


// Dans user-etablissement-sante.service.ts
import { Image, ImageMotifEnum } from '../image/entities/image.entity'; 

@Injectable()
export class UserEtablissementSanteService {
  // 🔒 Liste en mémoire des tokens révoqués
private readonly revokedTokens: Set<string> = new Set();

/**
 * Déconnecte un établissement de santé en révoquant le token JWT
 * @param token JWT à invalider
 */
logout(token: string) {
  this.revokedTokens.add(token);
  return { message: 'Déconnexion réussie.' };
}

/**
 * Vérifie si un token JWT est révoqué (blacklisté)
 * @param token le JWT à vérifier
 * @returns true si invalide, sinon false
 */
isTokenRevoked(token: string): boolean {
  return this.revokedTokens.has(token);
}

  constructor(
    @InjectRepository(UserEtablissementSante)
    private readonly userRepo: Repository<UserEtablissementSante>,
    @InjectRepository(CodeVerifOtp)
    private readonly otpRepo: Repository<CodeVerifOtp>,

    @InjectRepository(RaisonSuppressionCompte)
    private readonly raisonRepo: Repository<RaisonSuppressionCompte>,


    @InjectRepository(UserEtablissementSante)
    private readonly userEtablissementRepo: Repository<UserEtablissementSante>,
    
    @InjectRepository(Image)
    private readonly imageRepo: Repository<Image>,
  ) {}

  async register(data: CreateUserEtablissementDto) {
    const exist = await this.userRepo.findOne({ where: { email: data.email } });
    const exist_numb = await this.userRepo.findOne({ where: { telephone: data.telephone } });
    if (exist) throw new BadRequestException('Email déjà utilisé');
    if (exist_numb) throw new BadRequestException('Téléphone déjà utilisé');

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

  async generateOtp(user: UserEtablissementSante) {
    const now = new Date();

    // 1. Vérifier dernière demande OTP
    const recent = await this.otpRepo.find({
      where: { userEtablissementSante: { id_user_etablissement_sante: user.id_user_etablissement_sante } },
      order: { expires_at: 'DESC' },
      take: 5,
    });

    if (recent.length > 0) {
      const last = recent[0];
      const diff = (now.getTime() - last.expires_at.getTime()) / 1000;

      if (diff < 60) throw new BadRequestException("Veuillez attendre 1 minute avant de redemander un code.");

      const within10min = recent.filter((otp) => (now.getTime() - otp.expires_at.getTime()) / 60_000 < 10);
      if (within10min.length >= 5) throw new BadRequestException("Trop de tentatives. Veuillez réessayer dans 10 minutes.");
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    const otp = this.otpRepo.create({
      otp_code: otpCode,
      expires_at: new Date(now.getTime() + 5 * 60 * 1000),
      userEtablissementSante: user,
      is_valid: true,
    });

    await this.otpRepo.save(otp);
    console.log(otp)
  }

  async verifyOtp(email: string, code: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) throw new BadRequestException('Utilisateur non trouvé');

    const otp = await this.otpRepo.findOne({
      where: {
        userEtablissementSante: { id_user_etablissement_sante: user.id_user_etablissement_sante },
        otp_code: code,
        is_valid: true,
      },
    });

    if (!otp) throw new BadRequestException('Code invalide');

    const now = new Date();
    if (otp.expires_at.getTime() < now.getTime()) {
      throw new BadRequestException('Code expiré');
    }

    otp.is_valid = false;
    await this.otpRepo.save(otp);

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

  async getProfile(id: number) {
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
  
    if (!user) throw new BadRequestException('Établissement non trouvé');
  
    // 🔍 Cherche l'image de profil (avatar)
    const image = await this.imageRepo.findOne({
      where: {
        id_user_etablissement_sante: id,
        motif: ImageMotifEnum.PROFILE,
      },
    });
  
    // ✅ Ajoute l'image dans la réponse (ou null si pas d'image)
    return {
      ...user,
      image_profil: image ? image.url_image : null,
    };
  }
  

  async updateProfile(id: number, dto: UpdateProfileEtablissementDto) {
    const user = await this.userRepo.findOneBy({ id_user_etablissement_sante: id });
    if (!user) throw new NotFoundException("Établissement introuvable");
  
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async regenerateOtp(identifiant: string) {
    const user = await this.userRepo.findOne({
      where: [{ email: identifiant }, { telephone: identifiant }],
    });
  
    if (!user) throw new BadRequestException("Établissement non trouvé");
  
    await this.generateOtp(user);
    return { message: "Un nouveau code OTP a été généré avec succès." };
  }
  

  async changePasswordWithOtp(dto: UpdatePasswordDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user) throw new NotFoundException("Établissement non trouvé");
  
    const otp = await this.otpRepo.findOne({
      where: {
        otp_code: dto.otp_code,
        is_valid: true,
        userEtablissementSante: { id_user_etablissement_sante: user.id_user_etablissement_sante },
      },
    });
  
    if (!otp) throw new BadRequestException("Code OTP invalide");
    if (otp.expires_at.getTime() < new Date().getTime()) throw new BadRequestException("Code OTP expiré");
  
    otp.is_valid = false;
    await this.otpRepo.save(otp);
  
    user.mot_de_passe = await bcrypt.hash(dto.nouveau_mot_de_passe, 10);
    await this.userRepo.save(user);
  
    return { message: 'Mot de passe mis à jour avec succès' };
  }

  async deleteAccountWithReason(id: number, dto: DeleteAccountDto) {
    const user = await this.userRepo.findOne({ where: { id_user_etablissement_sante: id } });
    if (!user) throw new BadRequestException("Établissement introuvable");
  
    const otp = await this.otpRepo.findOne({
      where: {
        userEtablissementSante: { id_user_etablissement_sante: id },
        otp_code: dto.otp_code,
        is_valid: true,
      },
    });
  
    if (!otp || otp.expires_at.getTime() < Date.now()) {
      throw new BadRequestException("OTP invalide ou expiré");
    }
  
    otp.is_valid = false;
    await this.otpRepo.save(otp);
  
    // Enregistrer la raison
    const raison = this.raisonRepo.create({
      raison: dto.raison,
      userEtablissementSante: user,
    });
    await this.raisonRepo.save(raison);

    console.log('🔍 ID utilisateur à supprimer :', id);

    // Supprimer l’établissement
    await this.userRepo.delete(id);
  
    return { message: 'Compte supprimé avec succès' };
  }
  
  
  async uploadOrUpdateAvatar(idEtablissement: number, file: Express.Multer.File) {
    const dossier = `dossier_hostolink_preset/${idEtablissement}_user_etablissement_sante`;
    const publicId = `${dossier}/avatar`; // nom fixe de l’image
  
    // Supprime l’ancienne image si elle existe dans Cloudinary
    await cloudinary.uploader.destroy(publicId); // même si elle n’existe pas, pas de souci
  
    // Upload de la nouvelle image avec public_id FIXE
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: dossier,
          public_id: 'avatar', // nom du fichier dans le dossier
          overwrite: true,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(uploadStream);
    });
  
    const uploaded = result as any;
  
    // Vérifie si une image existe déjà en base
    const oldImage = await this.imageRepo.findOne({
      where: {
        id_user_etablissement_sante: idEtablissement,
        motif: ImageMotifEnum.PROFILE,
      },
    });
  
    if (oldImage) {
      oldImage.url_image = uploaded.secure_url;
      oldImage.date = new Date();
      await this.imageRepo.save(oldImage);
    } else {
      const newImage = this.imageRepo.create({
        url_image: uploaded.secure_url,
        motif: ImageMotifEnum.PROFILE,
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
  
  
}
 