import { Injectable, InternalServerErrorException, BadRequestException, ConflictException } from '@nestjs/common';
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

  async checkUserExistence(identifier: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy([
      { email: identifier },
      { telephone: identifier }
    ]);
    return !!user;
  }

  async registerUser(identifier: string): Promise<{ success: boolean; message: string }> {
    try {
      const existingUser = await this.userRepository.findOneBy([
        { email: identifier },
        { telephone: identifier }
      ]);

      if (existingUser) {
        throw new ConflictException("Cet identifiant est déjà utilisé.");
      }

      const newUser = this.userRepository.create({
        email: identifier.includes('@') ? identifier : undefined,
        telephone: identifier.includes('@') ? undefined : identifier,
        code_confirmation: Math.floor(1000 + Math.random() * 9000).toString(),
        date_inscription: new Date(),
      } as Partial<User>);
      

      await this.userRepository.save(newUser);
      return { success: true, message: "Utilisateur inscrit, redirection vers la définition du mot de passe." };
    } catch (error) {
      console.error("❌ Erreur registerUser:", error);
      throw new InternalServerErrorException("Erreur lors de l'inscription");
    }
  }

  async setUserPassword(identifier: string, password: string): Promise<boolean> {
    if (!password.trim()) {
      throw new BadRequestException("Le mot de passe ne peut pas être vide");
    }

    const user = await this.userRepository.findOneBy([
      { email: identifier },
      { telephone: identifier }
    ]);

    if (!user) {
      throw new BadRequestException("Utilisateur non trouvé");
    }

    user.mdp = await bcrypt.hash(password.trim(), 10);
    await this.userRepository.save(user);
    return true;
  }

  async verifyUserPin(identifier: string, pin: string): Promise<boolean> {
    identifier = identifier.trim();
    pin = pin.trim();
  
    const user = await this.userRepository.findOneBy([
      { email: identifier },
      { telephone: identifier }
    ]);
  
    if (!user || !user.mdp) {
      return false;
    }
  
    return await bcrypt.compare(pin, user.mdp);
  }

  async getAllUsers(): Promise<{ success: boolean; users: User[] }> {
    try {
      const users = await this.userRepository.find();
      return { success: true, users };
    } catch (error) {
      throw new InternalServerErrorException("Impossible de récupérer les utilisateurs");
    }
  }

  async getUserById(id_user: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id_user });
    if (!user) throw new BadRequestException("Utilisateur introuvable");
    return user;
  }

  async findUserByIdentifier(identifier: string): Promise<User | null> {
    return await this.userRepository.findOneBy([
      { email: identifier },
      { telephone: identifier }
    ]);
  }

  async findUserById(id_user: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id_user });
  }
  
  
  
  
  
}



// import { Injectable, InternalServerErrorException, BadRequestException, ConflictException } from '@nestjs/common';
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

//   async findUserById(id: number): Promise<User | null> {
//     return this.userRepository.findOne({ where: { id_user: id } });
//   }

//   async findUserByIdentifier(identifier: string): Promise<User | null> {
//     return await this.userRepository.findOne({
//       where: [{ email: identifier }, { telephone: identifier }],
//     });
//   }
  
//   async getUserById(id_user: number) {
//     return await this.userRepository.findOne({ where: { id_user } });
//   }

//   // ✅ Vérifie si un utilisateur existe (email ou téléphone)
//   async checkUserExistence(identifier: string): Promise<boolean> {
//     identifier = identifier.trim();
//     const user = await this.userRepository.findOne({
//       where: [{ email: identifier }, { telephone: identifier }],
//     });
//     return !!user;
//   }

//   // ✅ Inscrit un utilisateur sans mot de passe
//   async registerUser(identifier: string): Promise<{ success: boolean; message: string }> {
//     try {
//       identifier = identifier.trim();

//       // ✅ Vérifie si l'utilisateur existe déjà
//       const existingUser = await this.userRepository.findOne({
//         where: identifier.includes('@') 
//           ? { email: identifier }
//           : { telephone: identifier }
//       });

//       if (existingUser) {
//         if (existingUser.email === identifier) {
//           throw new ConflictException("Email déjà utilisé");
//         }
//         if (existingUser.telephone === identifier) {
//           throw new ConflictException("Numéro déjà utilisé");
//         }
//       }

//       // ✅ Crée un nouvel utilisateur
//       const newUser = new User();
//       if (identifier.includes('@')) {
//         newUser.email = identifier;
//       } else {
//         newUser.telephone = identifier;
//       }
//       newUser.code_confirmation = Math.floor(1000 + Math.random() * 9000).toString();
//       newUser.date_inscription = new Date();

//       await this.userRepository.save(newUser);
//       return { success: true, message: "Utilisateur inscrit, redirection vers la définition du mot de passe." };

//     } catch (error) {
//       if (error instanceof ConflictException) {
//         throw error; // ✅ Renvoie le message exact "Email déjà utilisé" ou "Numéro déjà utilisé"
//       }
//       console.error("❌ Erreur dans registerUser:", error);
//       throw new InternalServerErrorException("Une erreur inattendue s'est produite, veuillez réessayer.");
//     }
//   }

//   // ✅ Définit un mot de passe sécurisé
//   async setUserPassword(identifier: string, password: string): Promise<boolean> {
//     identifier = identifier.trim();
//     password = password.trim();

//     if (!password) {
//       throw new BadRequestException("Le mot de passe ne peut pas être vide");
//     }

//     const user = await this.userRepository.findOne({
//       where: [{ email: identifier }, { telephone: identifier }],
//     });

//     if (!user) {
//       throw new BadRequestException("Utilisateur non trouvé");
//     }

//     user.mdp = await bcrypt.hash(password, 10);
//     await this.userRepository.save(user);
//     return true;
//   }

//   // ✅ Vérifie un PIN de connexion (mot de passe)
//   async verifyUserPin(identifier: string, pin: string): Promise<boolean> {
//     identifier = identifier.trim();
//     pin = pin.trim();

//     const user = await this.userRepository.findOne({
//       where: [{ email: identifier }, { telephone: identifier }],
//     });

//     if (!user || !user.mdp) {
//       return false;
//     }
//     return await bcrypt.compare(pin, user.mdp);
//   }

//   // ✅ Vérifie un code de confirmation (OTP)
//   async verifyConfirmationCode(identifier: string, code: string): Promise<boolean> {
//     identifier = identifier.trim();
//     code = code.trim();

//     const user = await this.userRepository.findOne({
//       where: [{ email: identifier }, { telephone: identifier }],
//     });

//     if (!user || user.code_confirmation !== code) {
//       return false;
//     }

//     user.code_confirmation = "";
//     await this.userRepository.save(user);
//     return true;
//   }

//   // ✅ Récupère tous les utilisateurs
//   async getAllUsers(): Promise<{ success: boolean; users: User[] }> {
//     try {
//       const users = await this.userRepository.find();
//       return { success: true, users };
//     } catch (error) {
//       throw new InternalServerErrorException("Impossible de récupérer les utilisateurs");
//     }
//   }
// }
