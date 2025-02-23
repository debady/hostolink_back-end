import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ✅ Vérifie si un utilisateur existe (email ou téléphone)
  async checkUserExistence(identifier: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: [
        { email: identifier },
        { telephone: identifier }
      ],
    });

    return !!user; // Retourne `true` si l'utilisateur existe, `false` sinon
  }

  // ✅ Insère un utilisateur sans mot de passe s'il n'existe pas
  async createUserWithoutPassword(identifier: string): Promise<boolean> {
    const userExists = await this.checkUserExistence(identifier);
    if (userExists) return false; // Déjà existant, donc ne pas créer

     // ✅ Générer un code de confirmation à 4 chiffres
    const codeConfirmation = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser = new User();
    if (identifier.includes('@')) {
      newUser.email = identifier;
    } else {
      newUser.telephone = identifier;
    }
    newUser.code_confirmation = codeConfirmation; // ✅ Affectation ici
    newUser.date_inscription = new Date();

    await this.userRepository.save(newUser);
    // ✅ Affichage pour vérifier dans la console (temporaire)
    console.log(`📩 Code de confirmation généré pour ${identifier}: ${codeConfirmation}`);

    return true; // Utilisateur créé avec succès
  }

  // ✅ Définit le mot de passe après inscription
  async setUserPassword(identifier: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: [
        { email: identifier },
        { telephone: identifier }
      ],
    });

    if (!user) {
      return false; // L'utilisateur n'existe pas, impossible de définir le mot de passe
    }

    user.mdp = await bcrypt.hash(password, 10);
    await this.userRepository.save(user);
    return true; // Mot de passe défini avec succès
  }

  // ✅ Vérifie le code de confirmation (SMS ou Email)
  async verifyConfirmationCode(identifier: string, code: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    if (!user || user.code_confirmation !== code) {
      return false;
    }

    return true;
  }

  // ✅ Vérifie le PIN de connexion (mot de passe)
  async verifyUserPin(identifier: string, pin: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    if (!user || !user.mdp) {
      return false;
    }

    // Vérifie le mot de passe hashé (PIN)
    return await bcrypt.compare(pin, user.mdp);
    // return isMatch;
  }

  async registerUser(identifier: string): Promise<boolean> {
      const userExists = await this.checkUserExistence(identifier);
      if (userExists) {
          return false; // L'utilisateur existe déjà
      }

      // Générer un code de confirmation à 4 chiffres
      const codeConfirmation = Math.floor(1000 + Math.random() * 9000).toString();

      const newUser = new User();
      if (identifier.includes('@')) {
          newUser.email = identifier;
      } else {
          newUser.telephone = identifier;
      }

      newUser.code_confirmation = codeConfirmation;

      // ✅ Sauvegarde dans la base de données
      await this.userRepository.save(newUser);

      // ✅ Afficher le code dans la console (à remplacer plus tard par SMS/Email)
      console.log(`📩 Code de confirmation pour ${identifier}: ${codeConfirmation}`);

      return true;
  }


  // ✅ Récupère tous les utilisateurs
    async getAllUsers(): Promise<User[]> {
      try {
        const users = await this.userRepository.find();
        console.log(`👥 ${users.length} utilisateurs trouvés`);
        return users;
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des utilisateurs :", error);
        throw new Error("Impossible de récupérer les utilisateurs");
      }
    }

}
