import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { ImageMotifEnum } from './entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    id_user: string, // ✅ Correction : UUID
    motif: ImageMotifEnum,
    type_user?: string,
    id_user_etablissement_sante?: number,
  ): Promise<Image> {
    if (!file || !file.buffer) {
      throw new InternalServerErrorException('Le fichier est invalide ou non reçu');
    }

    try {
      // 🔄 Supprimer l'ancienne image de profil avant d'ajouter la nouvelle
      if (motif === ImageMotifEnum.PROFILE) {
        const existingImage = await this.imageRepository.findOne({ where: { id_user, motif } });

        if (existingImage) {
          const urlParts = existingImage.url_image.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split('.')[0];

          // ✅ Supprimer l'ancienne image Cloudinary
          await cloudinary.uploader.destroy(publicId);
          // ✅ Supprimer l'entrée en base
          await this.imageRepository.delete(existingImage.id_image);
        }
      }

      // 🔄 Upload de la nouvelle image sur Cloudinary avec optimisation
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'dossier_hostolink_preset', // 📂 Dossier de stockage Cloudinary
            transformation: [{ quality: "auto", fetch_format: "auto" }] // 🔄 Optimisation automatique
          },
          (error, result) => (error ? reject(error) : resolve(result!)),
        );
        stream.end(file.buffer);
      });

      if (!result || !result.secure_url) {
        throw new InternalServerErrorException('Erreur lors du téléversement sur Cloudinary');
      }

      // ✅ Enregistrement de la nouvelle image en base de données
      const newImage = this.imageRepository.create({
        url_image: result.secure_url,
        id_user,
        motif: motif || ImageMotifEnum.PROFILE,
        type_user,
      });

      return await this.imageRepository.save(newImage);
    } catch (error) {
      console.error('❌ Erreur Cloudinary:', error);
      throw new InternalServerErrorException('Échec du téléchargement sur Cloudinary');
    }
  }

  async getImageById(id: string): Promise<{ success: boolean; image?: Image; message?: string }> {
    const image = await this.imageRepository.findOne({ where: { id_image: id } });

    if (!image) {
      return { success: false, message: 'Image non trouvée' };
    }

    return { success: true, image };
  }

  async getAllImages(): Promise<Image[]> {
    return await this.imageRepository.find();
  }

  async deleteImage(id: string): Promise<{ success: boolean; message: string }> {
    const image = await this.imageRepository.findOneBy({ id_image: id });

    if (!image) {
      throw new NotFoundException('Image non trouvée');
    }

    try {
      // ✅ Extraire correctement le `publicId` de Cloudinary avant suppression
      const urlParts = image.url_image.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split('.')[0];

      // ✅ Supprimer l'image de Cloudinary
      await cloudinary.uploader.destroy(publicId);

      // ✅ Supprimer l'image de la base de données
      await this.imageRepository.delete(id);
      return { success: true, message: 'Image supprimée avec succès' };
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l’image:', error);
      throw new InternalServerErrorException('Impossible de supprimer l’image');
    }
  }
}
