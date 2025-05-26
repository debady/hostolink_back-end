// src/cloudinary/cloudinary.module.ts
import { Module } from '@nestjs/common';
import { SocialCloudinaryService } from './social_cloudinary.service';


@Module({
  providers: [SocialCloudinaryService],
  exports: [SocialCloudinaryService],
})
export class SocialCloudinaryModule {}
