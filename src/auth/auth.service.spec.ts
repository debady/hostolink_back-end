import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from './entities/utilisateur.entity';
import { CheckUserDto } from './dto/check-user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>, // ✅ Injection correcte
  ) {}

  async checkUserExists(checkUserDto: CheckUserDto): Promise<boolean> {
    const { identifier } = checkUserDto;
    
    const user = await this.utilisateurRepository.findOne({
      where: [
        { email: identifier },
        { telephone: identifier },
      ],
    });

    return !!user; // Retourne `true` si l'utilisateur existe, sinon `false`
  }

  // enregistrer l'utilisateur 
  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, telephone, mdp } = registerUserDto;
  
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.utilisateurRepository.findOne({
      where: [{ email }, { telephone }],
    });
  
    if (existingUser) {
      throw new BadRequestException('Un utilisateur avec cet email ou téléphone existe déjà.');
    }
  
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(mdp, 10);
  
    // Créer un nouvel utilisateur
    const newUser = this.utilisateurRepository.create({
      ...registerUserDto,
      mdp: hashedPassword, // Sauvegarde du mot de passe hashé
    });
  
    await this.utilisateurRepository.save(newUser);
  
    return { message: 'Utilisateur créé avec succès !' };
  }
}
