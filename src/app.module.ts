// ---------------------LOCAL ---------------------

import { UserModule } from './utilisateur/user.module'; // ✅ Module utilisateur
import { User } from './utilisateur/entities/user.entity'; // ✅ Entité utilisateur
import { AuthModule } from './auth/auth.module'; // ✅ Module d'authentification
import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm'; // ✅ ORM TypeORM pour PostgreSQL
import { ConfigModule } from '@nestjs/config'; // ✅ Gestion des variables d’environnement
import { Otp } from './code_verif_otp/entities/otp.entity'; // ✅ Entité OTP
import { NotificationsModule } from './notifications/notifications.module'; // ✅ Module des notifications (emails, SMS)
// import { EtablissementSanteModule } from './localisation_etablissement_sante/etablissement_sante.module';

@Module({
  imports: [
    // ✅ Chargement des variables d'environnement depuis `.env`
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    // ✅ Module gérant les notifications (email OTP)
    NotificationsModule,
    // EtablissementSanteModule,

    // ✅ Connexion à la base de données PostgreSQL via TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'NGUESSAN',
      database: process.env.DATABASE_NAME || 'hostolink_bd',
      autoLoadEntities: false, // ❌ Désactivé pour éviter le chargement automatique des entités
      synchronize: false, // ❌ Désactivé pour éviter les pertes de données accidentelles
      entities: [User, Otp], // ✅ Déclaration explicite des entités utilisées
    }),

    // ✅ Modules principaux de l’application
    UserModule, // ✅ Module de gestion des utilisateurs
    AuthModule, // ✅ Module d'authentification

    // ✅ Modules supplémentaires (commentés pour l’instant)
    // ImageModule, // ✅ Gestion des images
    // PublicationModule, // ✅ Gestion des publications
    // CommentaireModule, // ✅ Gestion des commentaires
    // PartageModule, // ✅ Gestion des partages
    // EtablissementSanteModule, // ✅ Gestion des établissements de santé
  ],
})
export class AppModule {}



// // ----------en ligne ------------------

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { UserModule } from './user/user.module';
// import { AuthModule } from './auth/auth.module';
// import { ImageModule } from './image/image.module';
// import { PublicationModule } from './publication/publication.module';
// import { CommentaireModule } from './commentaire/commentaire.module';
// import { PartageModule } from './partage/partage.module';


// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DB_HOST,
//       port: Number(process.env.DB_PORT),
//       username: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_NAME,
//       autoLoadEntities: true,
//       synchronize: false,
//       migrations: [__dirname + '/migrations/*{.ts,.js}'],
//       migrationsRun: true,
//       logging: process.env.NODE_ENV !== 'production',
//       extra: process.env.DB_SSL === 'true'
//         ? { ssl: { rejectUnauthorized: false } }
//         : undefined,
//     }),
//     UserModule,
//     AuthModule,
//     ImageModule,
//     PublicationModule,
//     CommentaireModule,
//     PartageModule,
//   ],

// })
// export class AppModule {}
// console.log('📌 Connexion à PostgreSQL avec URL :', process.env.DB_HOST);