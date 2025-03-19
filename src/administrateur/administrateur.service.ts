import { Injectable, ConflictException, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Administrateur } from './entities/administrateur.entity';
import { CreateAdministrateurDto } from './dto/create-administrateur.dto';
import { LoginAdministrateurDto } from './dto/login-administrateur.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdministrateurService {
  constructor(
    @InjectRepository(Administrateur)
    private readonly adminRepository: Repository<Administrateur>,
    private readonly jwtService: JwtService,
  ) {}

  async inscrireAdministrateur(dto: CreateAdministrateurDto) {
    const existant = await this.adminRepository.findOne({
      where: [{ email: dto.email }, { telephone: dto.telephone }],
    });
    if (existant) throw new ConflictException('Email ou téléphone déjà utilisé.');

    if (!dto.mot_de_passe || dto.mot_de_passe.length < 6) {
      throw new BadRequestException('Le mot de passe doit contenir au moins 6 caractères.');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.mot_de_passe, salt);

    const role = dto.role || 'admin';

    const administrateur = this.adminRepository.create({
      ...dto,
      mot_de_passe: hash,
      role,
      nom_image: dto.nom_image || undefined,
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
          nom_image: nouvelAdmin.nom_image,
        },
      };
    } catch (error) {
      throw new Error('Une erreur est survenue lors de l’inscription.');
    }
  }

  async connexionAdministrateur(dto: LoginAdministrateurDto) {
    if (!dto.email && !dto.telephone) {
      throw new BadRequestException('Vous devez fournir soit un email, soit un numéro de téléphone.');
    }

    let admin;
    if (dto.email) {
      admin = await this.adminRepository.findOneBy({ email: dto.email });
    } else if (dto.telephone) {
      admin = await this.adminRepository.findOneBy({ telephone: dto.telephone });
    }

    if (!admin) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const isPasswordValid = await bcrypt.compare(dto.mot_de_passe, admin.mot_de_passe);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const payload = { id: admin.id_admin_gestionnaire, role: admin.role };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Connexion réussie',
      administrateur: {
        id: admin.id_admin_gestionnaire,
        email: admin.email,
        telephone: admin.telephone,
        role: admin.role,
      },
      access_token: token,
    };
  }

  async getAdminById(id: number) {
    const admin = await this.adminRepository.findOne({
      where: { id_admin_gestionnaire: id },
      select: [
        'id_admin_gestionnaire',
        'email',
        'telephone',
        'role',
        'permissions',
        'statut',
        'dernier_connexion',
        'date_creation',
        'date_modification',
        'nom_image',
      ],
    });
  
    if (!admin) {
      throw new NotFoundException('Administrateur non trouvé.');
    }
  
    return admin;
  }
  
}

