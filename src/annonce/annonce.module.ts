import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnonceService } from './annonce.service';
import { AnnonceController } from './annonce.controller';
import { Annonce } from './entities/annonce.entity';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
import { AdministrateurModule } from 'src/administrateur/administrateur.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Annonce, Administrateur]), // Ajouter Administrateur ici
    AdministrateurModule
  ],
  controllers: [AnnonceController],
  providers: [AnnonceService],
})
export class AnnonceModule {}
