// src/cloudinary/cloudinary.module.ts
import { Module } from '@nestjs/common';
import { SocialCloudinaryServicess } from './social_cloudinary.service';


@Module({
  providers: [SocialCloudinaryServicess],
  exports: [SocialCloudinaryServicess],
})
export class SocialCloudinaryModule {}
