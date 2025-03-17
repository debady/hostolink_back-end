
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { Publication } from './entities/publication.entity';
import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { CloudinaryProvider } from 'src/cloudinary/cloudinary.providers';

@Module({
  imports: [TypeOrmModule.forFeature([Publication, Commentaire])],
  controllers: [PublicationController],
  providers: [PublicationService, CloudinaryProvider], 
 
  exports: [CloudinaryProvider], // ✅ Permettre l'utilisation de Cloudinary ailleurs
})
export class PublicationModule {}