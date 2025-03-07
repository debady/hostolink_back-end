import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etablissement } from './etablissement/entities/etablissement_sante.entity';
import { Utilisateur } from './utilisateurs/entities/utilisateur.entity';
import { UtilisateurModule } from './utilisateurs/utilisateur.module';
import { EtablissementModule } from './etablissement/etablissement_sante.module';



@Module({
  imports: [
    // Connexion PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'NGUESSAN',
      database: 'hostolink_bd',
      entities: [Utilisateur, Etablissement], // Ajout de toutes les entités
      synchronize: false, // ⚠️ À désactiver en production
    }),

    // Ajout des modules principaux
    UtilisateurModule,
    EtablissementModule,

  ],
  controllers: [],  
  providers: [],
})
export class AppModule {}
