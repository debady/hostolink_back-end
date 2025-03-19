import { Injectable, ConflictException, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Administrateur } from './entities/administrateur.entity';
import { CreateAdministrateurDto } from './dto/create-administrateur.dto';
import { LoginAdministrateurDto } from './dto/login-administrateur.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateAdministrateurDto } from './dto/update-administrateur.dto';

@Injectable()
export class AdministrateurService {
  constructor(
    @InjectRepository(Administrateur)
    private readonly adminRepository: Repository<Administrateur>,
    private readonly jwtService: JwtService,
  ) {}

  async inscrireAdministrateur(dto: CreateAdministrateurDto) {
    // Vérifier si l'email ou le téléphone existent déjà
    const existant = await this.adminRepository.findOne({
      where: [{ email: dto.email }, { telephone: dto.telephone }],
    });
    if (existant) throw new ConflictException('Email ou téléphone déjà utilisé.');

    // Vérifier la validité du mot de passe
    if (!dto.mot_de_passe || dto.mot_de_passe.length < 6) {
      throw new BadRequestException('Le mot de passe doit contenir au moins 6 caractères.');
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.mot_de_passe, salt);

    // Définir le rôle par défaut si non fourni
    const role = dto.role || 'admin';

    // Création de l'administrateur avec le nom de l'image
    const administrateur = this.adminRepository.create({
      ...dto,
      mot_de_passe: hash,
      role,
      nom_image: dto.nom_image || undefined, // ✅ Ajout du champ `nom_image`
    });

    try {
      const nouvelAdmin = await this.adminRepository.save(administrateur);

      return {
        message: 'Administrateur inscrit avec succès',
        administrateur: {
          id: nouvelAdmin.id_admin_gestionnaire,
          email: nouvelAdmin.email,
          telephone: nouvelAdmin.telephone,
          role: nouvelAdmin.role,
          nom_image: nouvelAdmin.nom_image, // ✅ Retourne le nom de l'image
        },
      };
    } catch (error) {
      console.error('Erreur lors de l’inscription :', error);
      throw new Error('Une erreur est survenue lors de l’inscription.');
    }
  }

  async connexionAdministrateur(dto: LoginAdministrateurDto) {
    if (!dto.email && !dto.telephone) {
      throw new BadRequestException('Vous devez fournir soit un email, soit un numéro de téléphone.');
    }
  
    // Rechercher l'admin par email ou téléphone
    const admin = await this.adminRepository.findOne({
      where: [
        { email: dto.email },
        { telephone: dto.telephone }
      ].filter(condition => Object.values(condition)[0]), // Filtrer pour éviter des valeurs null
    });
  
    if (!admin) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
  
    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(dto.mot_de_passe, admin.mot_de_passe);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }
  
    // Générer le token JWT
    const payload = { id: admin.id_admin_gestionnaire, role: admin.role };
    const token = this.jwtService.sign(payload);
  
    return {
      message: 'Connexion réussie',
      administrateur: {
        id: admin.id_admin_gestionnaire,
        email: admin.email,
        telephone: admin.telephone,
        role: admin.role
      },
      access_token: token
    };
  }
  

  
}
