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

  // ✅ Vérifie si un utilisateur existe (email ou téléphone)
  async checkUserExistence(identifier: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy([
      { email: identifier },
      { telephone: identifier }
    ]);
    return !!user;
  }

  // ✅ Inscrit un utilisateur sans mot de passe
  async registerUser(identifier: string): Promise<{ success: boolean; message: string }> {
    try {
      const existingUser = await this.userRepository.findOneBy([
        { email: identifier },
        { telephone: identifier }
      ]);

      // if (existingUser) {
      //   throw new ConflictException("Cet identifiant est déjà utilisé.");
      // }

      if (existingUser) {
        if (existingUser.email === identifier) {
          throw new ConflictException("Cet Email déjà utilisé");
        }
        if (existingUser.telephone === identifier) {
          throw new ConflictException("Cet Numéro déjà utilisé");
        }
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

  // ✅ Définit un mot de passe sécurisé
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

  // ✅ Vérifie un PIN de connexion (mot de passe)
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

  // ✅ Vérifie un code de confirmation (OTP)
  async verifyConfirmationCode(identifier: string, code: string): Promise<boolean> {
    identifier = identifier.trim();
    code = code.trim();

    const user = await this.userRepository.findOne({
      where: [{ email: identifier }, { telephone: identifier }],
    });

    if (!user || user.code_confirmation !== code) {
      return false;
    }

    user.code_confirmation = "";
    await this.userRepository.save(user);
    return true;
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