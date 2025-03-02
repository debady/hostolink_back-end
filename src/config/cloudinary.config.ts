import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

// ✅ Vérification que `.env` est bien chargé
console.log('Cloudinary API Key in cloudinary.config.ts:', process.env.CLOUDINARY_API_KEY);

export const configureCloudinary = (configService: ConfigService) => {
  cloudinary.config({
    cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
    api_key: configService.get<string>('CLOUDINARY_API_KEY'),
    api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
  });
  return cloudinary;
};
