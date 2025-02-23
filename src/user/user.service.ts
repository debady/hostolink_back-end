
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

    const newUser = new User();
    if (identifier.includes('@')) {
      newUser.email = identifier;
    } else {
      newUser.telephone = identifier;
    }
    newUser.date_inscription = new Date();

    await this.userRepository.save(newUser);
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

  // ✅ Récupère tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }
}


// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { User } from './entities/user.entity';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   // ✅ Récupère tous les utilisateurs
//     async getAllUsers(): Promise<User[]> {
//       return await this.userRepository.find();
//     }


//   // ✅ Vérifie si un utilisateur existe par email ou téléphone
//   async checkUserExistence(identifier: string): Promise<boolean> {
//     const user = await this.userRepository.findOne({
//       where: [
//         { email: identifier },
//         { telephone: identifier }
//       ],
//     });

//     return !!user;
//   }

//   // ✅ Crée un utilisateur sans mot de passe s'il n'existe pas
//   async createUserWithoutPassword(identifier: string): Promise<void> {
//     const newUser = new User();
//     if (identifier.includes('@')) {
//       newUser.email = identifier;
//     } else {
//       newUser.telephone = identifier;
//     }
//     newUser.date_inscription = new Date();
//     await this.userRepository.save(newUser);
//   }

//   // ✅ Définit le mot de passe après inscription
//   async setUserPassword(identifier: string, password: string): Promise<boolean> {
//     const user = await this.userRepository.findOne({
//       where: [
//         { email: identifier },
//         { telephone: identifier }
//       ],
//     });

//     if (!user) {
//       return false;
//     }

//     user.mdp = await bcrypt.hash(password, 10);
//     await this.userRepository.save(user);
//     return true;
//   }
// }

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { User } from './entities/user.entity';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   // ✅ Vérifie si un utilisateur existe par email ou téléphone
//   async checkUserExistence(identifier: string): Promise<boolean> {
//     const user = await this.userRepository.findOne({
//       where: [
//         { email: identifier },
//         { telephone: identifier }
//       ],
//     });

//     return !!user;
//   }

//   // ✅ Enregistre un nouvel utilisateur
//   async registerUser(identifier: string, password: string): Promise<boolean> {
//     const userExists = await this.checkUserExistence(identifier);
//     if (userExists) {
//       return false; // L'utilisateur existe déjà
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // ✅ Utilisation de new User() pour éviter les erreurs TypeORM
//     const newUser = new User();
//     if (identifier.includes('@')) {
//       newUser.email = identifier;
//     } else {
//       newUser.telephone = identifier;
//     }
//     newUser.mdp = hashedPassword;
//     newUser.date_inscription = new Date(); // ✅ Ajout manuel de la date d'inscription

//     // Sauvegarde dans la base de données
//     await this.userRepository.save(newUser);
//     return true; // Inscription réussie
//   }

//   // ✅ Nouvelle fonction pour récupérer tous les utilisateurs
//   async getAllUsers(): Promise<User[]> {
//     return await this.userRepository.find(); // Récupère tous les utilisateurs
//   }
// }
