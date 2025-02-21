import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // ✅ Chargement des variables d'environnement
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASS ?? 'NGUESSAN',
      database: process.env.DB_NAME ?? 'hostolink_bd',
      entities: [User], // ✅ Vérifie que l'entité est bien chargée
      autoLoadEntities: true,

      // ⚠️ Désactive synchronize pour éviter les pertes de données accidentelles en production
      synchronize: false,

      // ✅ Active les migrations pour bien gérer les évolutions de la base
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsRun: true, // Exécuter automatiquement les migrations au démarrage
      logging: true, // ✅ Active les logs SQL pour mieux comprendre les erreurs

    }),
    UserModule, // ✅ Vérifie que le module User est bien importé
  ],
})
export class AppModule {}
