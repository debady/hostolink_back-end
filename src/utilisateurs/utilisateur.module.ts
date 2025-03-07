import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilisateurService } from './utilisateur.service';
import { UtilisateurController } from './utilisateur.controller';
import { Utilisateur } from './entities/utilisateur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Utilisateur])], // Connexion à la table utilisateur
  providers: [UtilisateurService], // Service qui contient la logique métier
  controllers: [UtilisateurController], // Contrôleur pour gérer les routes API
  exports: [UtilisateurService], // Permet à d'autres modules d'utiliser UtilisateurService
})
export class UtilisateurModule {}
