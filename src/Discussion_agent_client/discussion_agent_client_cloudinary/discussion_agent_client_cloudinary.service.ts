
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import toStream from 'buffer-to-stream'; // ✅ CORRECT

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class DiscussionAgentCloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('Aucun fichier reçu.'));

      const stream = cloudinary.uploader.upload_stream(
        { folder: 'Discussion-agent-client/message_en_image' },
        (error, result: UploadApiResponse) => {
          if (error) {
            console.error('❌ Erreur Cloudinary:', error);
            return reject(error);
          }
          resolve(result.secure_url);
        },
      );

      toStream(file.buffer).pipe(stream); // ✅ Corrigé
    });
  }
}
