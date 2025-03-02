import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Express } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly configService: ConfigService, // ✅ Ajout de ConfigService pour charger `.env`
  ) {
    // ✅ Configuration de Cloudinary AVANT utilisation
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<Image> {
    if (!file || !file.buffer) {
      throw new Error('Le fichier est invalide ou non reçu');
    }

    try {
      // ✅ Vérification que Cloudinary est bien configuré
      console.log('Cloudinary API Key:', this.configService.get<string>('CLOUDINARY_API_KEY'));

      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'dossier_hostolink_preset' },
          (error, result) => {
            if (error) {
              console.error('Erreur Cloudinary:', error);
              reject(new Error('Échec du téléchargement sur Cloudinary'));
            } else if (!result) {
              reject(new Error('Cloudinary n\'a retourné aucun résultat'));
            } else {
              resolve(result);
            }
          }
        );
        stream.end(file.buffer);
      });

      if (!result || !result.secure_url) {
        throw new Error('Erreur lors du téléversement sur Cloudinary');
      }

      const newImage = this.imageRepository.create({
        url_image: result.secure_url,
      });

      return await this.imageRepository.save(newImage);
    } catch (error) {
      console.error('Erreur Cloudinary:', error);
      throw new Error('Échec du téléchargement sur Cloudinary');
    }

    
  }

  async getImageById(id: string): Promise<{ success: boolean; image?: Image; message?: string }> {
    const image = await this.imageRepository.findOne({ where: { id_image: id } });
  
    if (!image) {
      return { success: false, message: "Image non trouvée" };
    }
  
    return { success: true, image };
  }

  async getAllImages(): Promise<Image[]> {
    return await this.imageRepository.find(); // 🔥 Récupère toutes les images
  }
  
  
  
}
