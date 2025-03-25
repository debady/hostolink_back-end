
// INSCRITPION AVEC CREATION AUTOMATIQUE DE COMPTE AVEC CODE QR
import { 
  Injectable, 
  InternalServerErrorException, 
  BadRequestException, 
  NotFoundException, 
  Inject, 
  forwardRef 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Image } from 'src/image/entities/image.entity';
import { ImageMotifEnum } from 'src/image/entities/image.entity';
import { ImageService } from 'src/image/image.service';
import { CompteService } from 'src/compte/compte.service';
import { QrCodeService } from 'src/qr-code/qr-code.service';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  
    @Inject(forwardRef(() => ImageService))
    private readonly imageService: ImageService,
  
    @Inject(forwardRef(() => CompteService))
    private readonly compteService: CompteService,
  
    @Inject(forwardRef(() => QrCodeService))
    private readonly qrCodeService: QrCodeService
  ) {}
  
  // ✅ Création d'un utilisateur sans mot de passe
  async registerUser(identifier: string): Promise<{ success: boolean; id_user?: string; message: string }> {
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
      } as Partial<User>);

      const savedUser = await this.userRepository.save(newUser);
      
      // ✅ Créer automatiquement un compte pour le nouvel utilisateur
      await this.compteService.createUserCompte(savedUser.id_user);
      
      // ✅ Créer automatiquement un QR code statique pour le nouvel utilisateur
      await this.qrCodeService.createStaticQrForNewUser(savedUser.id_user);



      // ✅ Créer automatiquement un QR code dynamique avec une durée de 60s
      await this.qrCodeService.createDynamicQrForUser(savedUser.id_user,); // 60 secondes


      return { success: true, id_user: savedUser.id_user, message: "Utilisateur inscrit, redirection vers la définition du mot de passe." };
    } catch (error) {
      throw new InternalServerErrorException("Erreur lors de l'inscription: " + error.message);
    }
  }

  // ✅ Définition d'un mot de passe sécurisé
  async setUserPassword(identifier: string, password: string): Promise<{ success: boolean; message: string }> {
    if (!password.trim()) {
      return { success: false, message: "Le mot de passe ne peut pas être vide." };
    }

    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    if (!user) {
      throw new BadRequestException(`L'identifiant ${identifier} est incorrect.`);
    }

    user.mdp = await bcrypt.hash(password.trim(), 10);
    await this.userRepository.save(user);

    return { success: true, message: "Mot de passe défini avec succès." };
  }

  // ✅ Récupération des informations utilisateur avec l'image de profil et le compte
  async getUserById(id_user: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id_user } });

    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }

    // Récupération de l'image de profil depuis la table images
    const profileImage = await this.imageRepository.findOne({
      where: { id_user, motif: ImageMotifEnum.PROFILE },
      order: { date: 'DESC' }
    });
    
    // Récupération des informations du compte de l'utilisateur
    const compte = await this.compteService.getUserCompte(id_user);

    return { 
      ...user, 
      photo_profile: profileImage ? profileImage.url_image : null,
      compte
    };
  }

  // ✅ Mise à jour du profil utilisateur avec gestion d'image
  async updateUserProfile(id_user: string, updateProfileDto: UpdateProfileDto, file?: Express.Multer.File) {
    const user = await this.userRepository.findOne({ where: { id_user } });
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable.");
    }

    if (!Object.keys(updateProfileDto).length && !file) {
      throw new BadRequestException("Aucune donnée à mettre à jour.");
    }

    // ✅ Si une nouvelle image est envoyée, on supprime l'ancienne et on ajoute la nouvelle
    let profileImageUrl: string | null = null;
    if (file) {
      const uploadedImage = await this.imageService.uploadImage(file, id_user, ImageMotifEnum.PROFILE);
      profileImageUrl = uploadedImage?.url_image ?? null;
    }

    // ✅ Mettre à jour les autres informations utilisateur
    await this.userRepository.update(id_user, updateProfileDto as Partial<User>);

    return { 
      success: true, 
      message: "Profil mis à jour avec succès."
    };
  }

// ✅ Trouve un utilisateur par email ou téléphone A ECRIS SON ENDPOINT 
async findUserByIdentifier(identifier: string): Promise<User | null> {
  return await this.userRepository.findOne({
    where: [{ email: identifier }, { telephone: identifier }],
  });
}

// ✅ Vérifier un code OTP et activer le compte
async verifyConfirmationCode(identifier: string, code: string): Promise<boolean> {
  identifier = identifier.trim();
  code = code.trim();

  const user = await this.userRepository.findOne({
    where: [{ email: identifier }, { telephone: identifier }],
  });

  // 🚨 Vérification si l'utilisateur existe
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  user.compte_verifier = true;
  await this.userRepository.save(user);

  return true;
}


  // ✅ Mettre compte_verifier = true
  async updateUserVerificationStatus(identifier: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    if (user) {
      user.compte_verifier = true;
      await this.userRepository.save(user);
    }
  }

  // ✅ Vérifie un PIN de connexion (mot de passe)
  async verifyUserPin(identifier: string, pin: string): Promise<boolean> {
    identifier = identifier.trim();
    pin = pin.trim();

    console.log(`🔐 Vérification du PIN pour ${identifier}`);

    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    if (!user || !user.mdp) {
      console.warn(`⚠️ Échec de la vérification PIN : utilisateur introuvable ou mot de passe manquant.`);
      return false;
    }

    const isValid = await bcrypt.compare(pin, user.mdp);

    if (isValid) {
      console.log(`✅ PIN correct pour ${identifier}`);
    } else {
      console.warn(`❌ PIN incorrect pour ${identifier}`);
    }

    return isValid;
  }
}