// ---------------------LOCAL ---------------------
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// ✅ Utilisateurs & Authentification
import { UserModule } from './utilisateur/user.module';
import { User } from './utilisateur/entities/user.entity';
import { AuthModule } from './auth/auth.module';

// ✅ OTP & Notifications
import { OtpModule } from './code_verif_otp/otp.module'; 
import { Otp } from './code_verif_otp/entities/otp.entity';

// ✅ Images & Établissements de Santé
import { ImageModule } from './image/image.module';
import { Image } from './image/entities/image.entity';
import { ListeNumeroEtablissementSanteModule } from './liste_etablissement/liste_numero_etablissement_sante.module';
import { CloudinaryModule } from './upload/cloudinary.module';
import { ListeNumeroEtablissementSante } from './liste_etablissement/entities/liste_numero_vert_etablissement_sante.entity';
import { AdministrateurModule } from './administrateur/administrateur.module';
import { Administrateur } from './administrateur/entities/administrateur.entity';
import { AnnonceModule } from './annonce/annonce.module';
import { Annonce } from './annonce/entities/annonce.entity';

import { Thematique } from './thematique_discussion/entities/thematique.entity';
import { ThematiqueDiscussionModule } from './thematique_discussion/thematique_discussion.module';
import { MessageThematique } from './thematique_discussion/entities/message_thematique.entity';
import { FirebaseModule } from './thematique_discussion/firebase/firebase.module';

import { forwardRef } from '@nestjs/common';
import { SmsModule } from './sms/sms.module';

// ✅ transaction interne
import { TransactionInterneModule } from './transaction-interne/transaction-interne.module';
import { TransactionFraisModule } from './transaction-frais/transaction-frais.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OtpService } from './code_verif_otp/otp.service';



@Module({
  imports: [
    forwardRef(() => SmsModule),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    //connexion à la base de données PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'NGUESSAN',
      database: process.env.DATABASE_NAME || 'hostolink_bd',
      autoLoadEntities: false,
      synchronize: false, 
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      //  entities: [User,Otp,Image, ListeNumeroEtablissementSante, Administrateur,Annonce, MessageThematique, Thematique], 
  }),
  UserModule,
  AuthModule,
  ImageModule,
  ListeNumeroEtablissementSanteModule,
  CloudinaryModule,
  NotificationsModule,
  AdministrateurModule,
  AnnonceModule,
  ThematiqueDiscussionModule,
  FirebaseModule,
  OtpModule,
  TransactionFraisModule,
  TransactionInterneModule

  // PublicationModule,
  // CommentaireModule,
  // PartageModule,
  // EtablissementSanteModule, 
  // EtablissementSanteModule
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class AppModule {}



// // ----------en ligne ------------------
  // UserEtablissementModule,
  // PublicationModule, 
  // CommentaireModule, 
  // PartageModule, 
  // EtablissementSanteModule, 

// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';
// import { ImageModule } from './image/image.module';
// import { UserModule } from './utilisateur/user.module';
// import { GestionUtilisateurModule } from './administrateur/Gest_utilisateurs/gestion_utilisateur.module';
// import { OtpModule } from './code_verif_otp/otp.module';
// import { SmsModule } from './sms/sms.module';
// import { NotificationsModule } from './notifications/notifications.module';
// import { OtpService } from './code_verif_otp/otp.service';
// import { AdministrateurModule } from './administrateur/administrateur.module';
// import { TransactionInterneModule } from './transaction-interne/transaction-interne.module';
// import { TransactionFraisModule } from './transaction-frais/transaction-frais.module';


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
//   UserModule, 
//   AuthModule, 
//   ImageModule, 
//   AdministrateurModule,
//   GestionUtilisateurModule,
//   OtpModule, 
//   SmsModule,
//   NotificationsModule
//   ],
// providers: [OtpService],
// exports: [OtpService],

// })
// export class AppModule {}
// console.log('📌 Connexion à PostgreSQL avec URL :', process.env.DB_HOST);