import { Injectable, InternalServerErrorException, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  findOne(userId: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ Vérifie si un utilisateur existe (email ou téléphone)
  async checkUserExistence(identifier: string): Promise<boolean> {
    console.log(`🔍 Vérification de l'existence de l'utilisateur : ${identifier}`);
    
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    return !!user;
  }

  async registerUser(identifier: string): Promise<{ success: boolean; id_user?: string; message: string }> {
    try {
        console.log(`📝 Tentative d'inscription pour : ${identifier}`);

        const existingUser = await this.userRepository.findOne({
            where: [{ email: identifier }, { telephone: identifier }],
        });

        if (existingUser) {
            if (existingUser.email === identifier) {
                console.error(`❌ Échec : L'email ${identifier} est déjà utilisé.`);
                return { success: false, message: `L'email ${identifier} est déjà utilisé.` };
            }
            if (existingUser.telephone === identifier) {
                console.error(`❌ Échec : Le numéro ${identifier} est déjà utilisé.`);
                return { success: false, message: `Le numéro ${identifier} est déjà utilisé.` };
            }
        }

        const newUser = this.userRepository.create({
            email: identifier.includes('@') ? identifier : undefined,
            telephone: identifier.includes('@') ? undefined : identifier,
            code_confirmation: Math.floor(1000 + Math.random() * 9000).toString(),
            date_inscription: new Date(),
        } as Partial<User>);

        await this.userRepository.save(newUser);

        console.log(`✅ Inscription réussie : id_user = ${newUser.id_user}`);
        return { success: true, id_user: newUser.id_user, message: "Utilisateur inscrit, redirection vers la définition du mot de passe." };

    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        throw new InternalServerErrorException("Erreur lors de l'inscription");
    }
}


// ✅ Définit un mot de passe sécurisé avec gestion correcte des erreurs
async setUserPassword(identifier: string, password: string): Promise<{ success: boolean; message: string }> {
  if (!password.trim()) {
      console.error("❌ Erreur : Mot de passe vide.");
      return { success: false, message: "Le mot de passe ne peut pas être vide." };
  }

  const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
  });

  if (!user) {
    console.error(`❌ Erreur : Identifiant incorrect pour ${identifier}`);
    throw new BadRequestException(
      identifier.includes("@")
        ? `L'email ${identifier} est incorrect.`
        : `Le numéro ${identifier} est incorrect.`
    );
  }
  
  

  user.mdp = await bcrypt.hash(password.trim(), 10);
  await this.userRepository.save(user);

  console.log(`🔑 Mot de passe défini avec succès pour l'utilisateur ${identifier}`);
  return { success: true, message: "Mot de passe défini avec succès." };
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

  // ✅ Vérifie un code de confirmation (OTP)
  async verifyConfirmationCode(identifier: string, code: string): Promise<boolean> {
    identifier = identifier.trim();
    code = code.trim();

    console.log(`📩 Vérification du code OTP pour ${identifier}`);

    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    if (!user || user.code_confirmation !== code) {
      console.warn(`❌ Échec de la vérification OTP pour ${identifier}`);
      return false;
    }

    user.code_confirmation = "";
    user.compte_verifier = true; // ✅ Met à jour le compte comme vérifié
    await this.userRepository.save(user);

    console.log(`✅ Code OTP validé et compte vérifié pour ${identifier}`);
    return true;
  }

  // ✅ Récupère un utilisateur par son UUID
  async getUserById(id_user: string): Promise<User | null> {
    console.log(`🔍 Récupération de l'utilisateur avec id_user = ${id_user}`);
    
    const user = await this.userRepository.findOneBy({ id_user });

    if (!user) {
      console.warn(`❌ Utilisateur introuvable : id_user = ${id_user}`);
      throw new NotFoundException("Utilisateur introuvable");
    }

    return user;
  }

  // Par ceci
async findOneUserById(userId: string) {
  return this.userRepository.findOne({
    where: { id_user: userId }
  });
}

  // ✅ Trouve un utilisateur par email ou téléphone
  async findUserByIdentifier(identifier: string): Promise<User | null> {
    console.log(`🔍 Recherche d'un utilisateur avec identifiant : ${identifier}`);
    
    return await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });
  }

  // pour mettre compte_verifier = true :
  async updateUserVerificationStatus(identifier: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });
  
    if (user) {
      user.compte_verifier = true;
      await this.userRepository.save(user);
    }
  }

  // ✅ Nouvelle méthode pour récupérer un utilisateur par son UUID (id_user)
  async findUserById(id_user: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id_user }, // Recherche par UUID (id_user)
    });

    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    return user;
  }


  
}
