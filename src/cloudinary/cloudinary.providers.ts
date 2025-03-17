import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'Cloudinary',
  useFactory: (configService: ConfigService) => {
    // ✅ Configuration sécurisée via `.env`
    cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
    });

    // ✅ Vérification de la connexion à Cloudinary
    cloudinary.api.ping((error, result) => {
      if (error) {
        console.error('❌ Erreur de connexion à Cloudinary :', error);
      } else {
        console.log('✅ Connexion réussie à Cloudinary !', result);
      }
    });

    return cloudinary;
  },
  inject: [ConfigService],
};
