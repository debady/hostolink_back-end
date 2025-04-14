// // // ---------------------LOCAL ---------------------
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// ✅ Utilisateurs & Authentification
import { UserModule } from './utilisateur/user.module';
import { AuthModule } from './auth/auth.module';

// ✅ OTP & Notifications

// ✅ Images & Établissements de Santé
import { ImageModule } from './image/image.module';
import { ListeNumeroEtablissementSanteModule } from './liste_etablissement/liste_numero_etablissement_sante.module';
import { CloudinaryModule } from './upload/cloudinary.module';
import { AdministrateurModule } from './administrateur/administrateur.module';
import { AnnonceModule } from './annonce/annonce.module';

import { ThematiqueDiscussionModule } from './thematique_discussion/thematique_discussion.module';
import { FirebaseModule } from './thematique_discussion/firebase/firebase.module';


// ✅ transaction interne
import { TransactionInterneModule } from './transaction-interne/transaction-interne.module';
import { TransactionFraisModule } from './transaction-frais/transaction-frais.module';
import { UserEtablissementSanteModule } from './user_etablissement_sante/user-etablissement-sante.module';
import { QrDynamiqueModule } from './qr-dynamique_user_es/qr-dynamique.module';
import { PaiementModule } from './paiement_user_a_es/paiement.module';
import { ExpertSanteModule } from './user_etablissement_sante/expert-sante.module';

@Module({
  
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'mdp_dev_sohapigroup',
      database: process.env.DATABASE_NAME || 'hostolink_bd',
      autoLoadEntities: true,
      synchronize: false, 
      logging:false,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
  }),
  AuthModule,
  CloudinaryModule,
  FirebaseModule,

  AdministrateurModule,

  UserModule,
  ImageModule,
  ListeNumeroEtablissementSanteModule,
  AnnonceModule,
  ThematiqueDiscussionModule,
  TransactionFraisModule,
  TransactionInterneModule,
  
  UserEtablissementSanteModule,
  ExpertSanteModule,
  
  QrDynamiqueModule,
  PaiementModule,

  ],

})
export class AppModule {}



// ----------en ligne -----------------
// -
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';

// // ✅ Utilisateurs & Authentification
// import { UserModule } from './utilisateur/user.module';
// import { AuthModule } from './auth/auth.module';

// // ✅ OTP & Notifications

// // ✅ Images & Établissements de Santé
// import { ImageModule } from './image/image.module';
// import { ListeNumeroEtablissementSanteModule } from './liste_etablissement/liste_numero_etablissement_sante.module';
// import { CloudinaryModule } from './upload/cloudinary.module';
// import { AdministrateurModule } from './administrateur/administrateur.module';
// import { AnnonceModule } from './annonce/annonce.module';

// import { ThematiqueDiscussionModule } from './thematique_discussion/thematique_discussion.module';
// import { FirebaseModule } from './thematique_discussion/firebase/firebase.module';
// import { TransactionFraisModule } from './transaction-frais/transaction-frais.module';
// import { TransactionInterneModule } from './transaction-interne/transaction-interne.module';
// import { EtablissementSanteModule } from './localisation_etablissement_sante/etablissement_sante.module';
// import { GestionUtilisateurModule } from './administrateur/Gest_utilisateurs/gestion_utilisateur.module';


// @Module({
  
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

//     TypeOrmModule.forRoot({
//       type: 'postgres',
      
//       host: process.env.DATABASE_HOST || 'localhost',
//       port: Number(process.env.DATABASE_PORT) || 5432,
//       username: process.env.DATABASE_USER || 'postgres',
//       password: process.env.DATABASE_PASSWORD || 'mdp_dev_sohapigroup',
//       database: process.env.DATABASE_NAME || 'hostolink_bd',
//       autoLoadEntities: false,
//       synchronize: false, 
//       logging:false,
//       //  process.env.NODE_ENV !== 'production',
//       extra: process.env.DB_SSL === 'true'
//         ? { ssl: { rejectUnauthorized: false } }
//         : undefined,
//     }),
//   UserModule, 
//   AuthModule, 
//   ImageModule, 
//   AdministrateurModule,
//   GestionUtilisateurModule,
  
//   ListeNumeroEtablissementSanteModule,
//   CloudinaryModule,
//   AnnonceModule,
//   ThematiqueDiscussionModule,
//   FirebaseModule,
//   TransactionFraisModule,
//   TransactionInterneModule,
//   EtablissementSanteModule,  

//   // PublicationModule,
//   // CommentaireModule,
//   // PartageModule,
//   // PublicationModule, 
//   // CommentaireModule, 
//   // PartageModule, 
//   ],

// })
// export class AppModule {}



// // // ----------en ligne ------------------
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';

// // ✅ Utilisateurs & Authentification
// import { UserModule } from './utilisateur/user.module';
// import { AuthModule } from './auth/auth.module';

// // ✅ OTP & Notifications

// // ✅ Images & Établissements de Santé
// import { ImageModule } from './image/image.module';
// import { ListeNumeroEtablissementSanteModule } from './liste_etablissement/liste_numero_etablissement_sante.module';
// import { CloudinaryModule } from './upload/cloudinary.module';
// import { AdministrateurModule } from './administrateur/administrateur.module';
// import { AnnonceModule } from './annonce/annonce.module';

// import { ThematiqueDiscussionModule } from './thematique_discussion/thematique_discussion.module';
// import { FirebaseModule } from './thematique_discussion/firebase/firebase.module';


// // ✅ transaction interne
// import { TransactionInterneModule } from './transaction-interne/transaction-interne.module';
// import { TransactionFraisModule } from './transaction-frais/transaction-frais.module';
// import { UserEtablissementSante } from './user_etablissement_sante/entities/user-etablissement-sante.entity';
// import { UserEtablissementSanteModule } from './user_etablissement_sante/user-etablissement-sante.module';
// import { QrDynamiqueModule } from './qr-dynamique_user_es/qr-dynamique.module';
// import { PaiementModule } from './paiement_user_a_es/paiement.module';
// import { GestionUtilisateurModule } from './administrateur/Gest_utilisateurs/gestion_utilisateur.module';
// import { EtablissementSanteModule } from './localisation_etablissement_sante/etablissement_sante.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

//     TypeOrmModule.forRoot({
//       type: 'postgres',
      
//       host: process.env.DATABASE_HOST || 'localhost',
//       port: Number(process.env.DATABASE_PORT) || 5432,
//       username: process.env.DATABASE_USER || 'postgres',
//       password: process.env.DATABASE_PASSWORD || 'mdp_dev_sohapigroup',
//       database: process.env.DATABASE_NAME || 'hostolink_bd',
//       autoLoadEntities: false,
//       synchronize: false, 
//       logging:true,
//       entities: [__dirname + '/**/*.entity{.ts,.js}'],
//   }),
// UserModule, 
// AuthModule, 
// ImageModule, 
// AdministrateurModule,
// GestionUtilisateurModule,

// ListeNumeroEtablissementSanteModule,
// CloudinaryModule,
// AnnonceModule,
// ThematiqueDiscussionModule,
// FirebaseModule,
// TransactionFraisModule,
// TransactionInterneModule,
// EtablissementSanteModule, 
// UserEtablissementSante,
// UserEtablissementSanteModule,
// QrDynamiqueModule,
// PaiementModule,
// AdministrateurModule,
// PaiementModule,
// ExpertSanteModule
//   ],
//       logging:false,
//       //  process.env.NODE_ENV !== 'production',
//       extra: process.env.DB_SSL === 'true'
//         ? { ssl: { rejectUnauthorized: false } }
//         : undefined,
//     }),
//   UserModule, 
//   AuthModule, 
//   ImageModule, 
//   AdministrateurModule,
//   GestionUtilisateurModule,
  
// //   ListeNumeroEtablissementSanteModule,
// //   CloudinaryModule,
// //   AnnonceModule,
// //   ThematiqueDiscussionModule,
// //   FirebaseModule,
// //   TransactionFraisModule,
// //   TransactionInterneModule,
// //   EtablissementSanteModule,  

// //   // PublicationModule,
// //   // CommentaireModule,
// //   // PartageModule,
// //   // PublicationModule, 
// //   // CommentaireModule, 
// //   // PartageModule, 
// //   ],


// })
// export class AppModule {}
// console.log('📌 Connexion à PostgreSQL avec URL :', process.env.DB_HOST);


// ----------en ligne -----------------
// -
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { AuthModule } from './auth/auth.module';
// import { ImageModule } from './image/image.module';
// import { UserModule } from './utilisateur/user.module';
// import { GestionUtilisateurModule } from './administrateur/Gest_utilisateurs/gestion_utilisateur.module';
// import { AdministrateurModule } from './administrateur/administrateur.module';
// import { ListeNumeroEtablissementSanteModule } from './liste_etablissement/liste_numero_etablissement_sante.module';
// import { CloudinaryModule } from './upload/cloudinary.module';
// import { AnnonceModule } from './annonce/annonce.module';
// import { ThematiqueDiscussionModule } from './thematique_discussion/thematique_discussion.module';
// import { FirebaseModule } from './thematique_discussion/firebase/firebase.module';
// import { TransactionFraisModule } from './transaction-frais/transaction-frais.module';
// import { TransactionInterneModule } from './transaction-interne/transaction-interne.module';
// import { EtablissementSanteModule } from './localisation_etablissement_sante/etablissement_sante.module';
// import { UserEtablissementSante } from './user_etablissement_sante/entities/user-etablissement-sante.entity';
// import { UserEtablissementSanteModule } from './user_etablissement_sante/user-etablissement-sante.module';
// import { QrDynamiqueModule } from './qr-dynamique_user_es/qr-dynamique.module';
// import { PaiementModule } from './paiement_user_a_es/paiement.module';
// import { ExpertSanteModule } from './user_etablissement_sante/expert-sante.module';


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
//       logging:false,
//       //  process.env.NODE_ENV !== 'production',
//       extra: process.env.DB_SSL === 'true'
//         ? { ssl: { rejectUnauthorized: false } }
//         : undefined,
//     }),
//     UserModule, 
//     AuthModule, 
//     ImageModule, 
//     AdministrateurModule,
//     GestionUtilisateurModule,
    
//     ListeNumeroEtablissementSanteModule,
//     CloudinaryModule,
//     AnnonceModule,
//     ThematiqueDiscussionModule,
//     FirebaseModule,
//     TransactionFraisModule,
//     TransactionInterneModule,
//     EtablissementSanteModule, 
//     UserEtablissementSante,
//     UserEtablissementSanteModule,
//     QrDynamiqueModule,
//     PaiementModule,
//     AdministrateurModule,
//     PaiementModule,
//     ExpertSanteModule,

//   // PublicationModule,
//   // CommentaireModule,
//   // PartageModule,
//   // PublicationModule, 
//   // CommentaireModule, 
//   // PartageModule, 
//   ],


// })
// export class AppModule {}
// console.log('📌 Connexion à PostgreSQL avec URL :', process.env.DB_HOST);