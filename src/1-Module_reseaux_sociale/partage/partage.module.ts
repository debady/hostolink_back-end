
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartageController } from './partage.controller';
import { PartageService } from './partage.service';
import { Partage } from './entities/partage.entity';
import { Publication } from 'src/1-Module_reseaux_sociale/publication/entities/publication.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([
    Partage,
    Publication // ✅ AJOUTÉ
  ])],
  controllers: [PartageController],
  providers: [PartageService],
  exports: [PartageService],
})
export class PartageModule {}