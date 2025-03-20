// ---------------------LOCAL ---------------------

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Utilisateurs & Authentification
import { UserModule } from './utilisateur/user.module';
import { User } from './utilisateur/entities/user.entity';
import { AuthModule } from './auth/auth.module';

// OTP & Notifications
import { Otp } from './code_verif_otp/entities/otp.entity';
import { NotificationsModule } from './notifications/notifications.module';

// Images & Établissements de Santé
import { ImageModule } from './image/image.module';
import { Image } from './image/entities/image.entity';
import { ListeNumeroEtablissementSanteModule } from './liste_etablissement/liste_numero_etablissement_sante.module';
import { CloudinaryModule } from './upload/cloudinary.module';
import { ListeNumeroEtablissementSante } from './liste_etablissement/entities/liste_numero_vert_etablissement_sante.entity';
import { AdministrateurModule } from './administrateur/administrateur.module';
import { Administrateur } from './administrateur/entities/administrateur.entity';
import { AnnonceModule } from './annonce/annonce.module';
import { Annonce } from './annonce/entities/annonce.entity';
// import { UserEtablissementModule } from './user-etablissement/user-etablissement.module';




@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    //connexion à la base de données PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'NGUESSAN',
      database: process.env.DATABASE_NAME || 'hostolink_bds_master',
      autoLoadEntities: false,
      synchronize: false, 
       entities: [User,Otp,Image, ListeNumeroEtablissementSante, Administrateur,Annonce ], 
  }),
  UserModule,
  AuthModule,
  ImageModule,
  ListeNumeroEtablissementSanteModule,
  CloudinaryModule,
  NotificationsModule,
  AdministrateurModule,
  AnnonceModule
  // PublicationModule,
  // CommentaireModule,
  // PartageModule,
  // EtablissementSanteModule, 
  // EtablissementSanteModule
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
// import { UserEtablissementModule } from './user-etablissement/user-etablissement.module';
// import { AdministrateurModule } from './administrateur/administrateur.module';


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