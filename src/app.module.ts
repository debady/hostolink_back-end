import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Localisation } from './localisation_sante/entities/localisation.entity';
import { LocalisationModule } from './localisation_sante/localisation.module';




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
      entities: [Localisation], // Ajout de l'entité Localisation
      synchronize: true, // À désactiver en production
    }),

    // Ajout du module de Localisation
    LocalisationModule,
  ],
  controllers: [],  
  providers: [],
})
export class AppModule {}
