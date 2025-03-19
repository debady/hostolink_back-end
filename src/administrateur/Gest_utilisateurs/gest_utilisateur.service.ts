import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../utilisateur/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';  // ✅ Celui d'admin

@Injectable()
export class GestUtilisateurService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<{ total: number; utilisateurs: User[] }> {
    const users = await this.userRepository.find({
      relations: ['images'],
    });
  
    // Filtrer pour ne garder que l'URL de la photo de profil
    const utilisateurs = users.map(user => ({
      ...user,
      image_profil: user.images?.find(img => img.motif === 'photo_profile')?.url_image || null,
      images: undefined, // Supprimer le champ "images"
    }));
  
    return {
      total: users.length,  // Nombre total d'utilisateurs
      utilisateurs,
    };
  }

  async findOne(id_user: string): Promise<Omit<User, 'images'> & { image_profil: string | null }> {
    const user = await this.userRepository.findOne({
      where: { id_user },
      relations: ['images'],
    });
  
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé.');
    }
  
    // Extraire uniquement l'URL de la photo de profil
    const image_profil = user.images?.find(img => img.motif === 'photo_profile')?.url_image || null;
  
    // Supprimer la propriété "images" avant de retourner l'utilisateur
    const { images, ...userSansImages } = user;
  
    return {
      ...userSansImages, // ✅ Toutes les propriétés sauf "images"
      image_profil,      // ✅ Ajout de l'URL de la photo de profil
    };
  }
  
  
  
  
  

  async updateBanReason(id_user: string, updateUserDto: UpdateUserDto): Promise<User & { image_profil: string | null }> {
    const { raison_banni } = updateUserDto;
  
    if (!raison_banni) {
      throw new BadRequestException('La raison du bannissement est requise.');
    }
  
    await this.userRepository.update(id_user, { raison_banni } as Partial<User>);
  
    return this.findOne(id_user);
  }
  
  

  async remove(id_user: string): Promise<void> {
    await this.userRepository.delete(id_user);
  }
}
