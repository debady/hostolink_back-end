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
import { UserEtablissementSante } from './user_etablissement_sante/entities/user-etablissement-sante.entity';
import { UserEtablissementSanteModule } from './user_etablissement_sante/user-etablissement-sante.module';
import { QrDynamiqueModule } from './qr-dynamique_user_es/qr-dynamique.module';
import { PaiementModule } from './paiement_user_a_es/paiement.module';
import { ExpertSanteModule } from './user_etablissement_sante/expert-sante.module';
import { GestionUtilisateurModule } from './administrateur/Gest_utilisateurs/gestion_utilisateur.module';
import { EtablissementSanteModule } from './localisation_etablissement_sante/etablissement_sante.module';
import { InvitationModule } from './invitations/invitation.module';

@Module({
  
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'NGUESSAN',
      database: process.env.DATABASE_NAME || ' hostolink_bds_reviser_toutes',
      autoLoadEntities: true,
      synchronize: false, 
      logging:false,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
  }),
  UserModule, 
  AuthModule, 
  ImageModule, 

  AdministrateurModule,
  GestionUtilisateurModule,
  InvitationModule,

  ListeNumeroEtablissementSanteModule,
  CloudinaryModule,
  AnnonceModule,

  ThematiqueDiscussionModule,
  FirebaseModule,
  TransactionFraisModule,

  TransactionInterneModule,
  EtablissementSanteModule, 
  UserEtablissementSante,

  UserEtablissementSanteModule,
  QrDynamiqueModule,
  PaiementModule,

  AdministrateurModule,
  PaiementModule,
  ExpertSanteModule,

  ],

})
export class AppModule {}
console.log('📌 Connexion à PostgreSQL avec URL :', process.env.DB_HOST);


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


// // ✅ transaction interne
// import { TransactionInterneModule } from './transaction-interne/transaction-interne.module';
// import { TransactionFraisModule } from './transaction-frais/transaction-frais.module';
// import { UserEtablissementSante } from './user_etablissement_sante/entities/user-etablissement-sante.entity';
// import { UserEtablissementSanteModule } from './user_etablissement_sante/user-etablissement-sante.module';
// import { QrDynamiqueModule } from './qr-dynamique_user_es/qr-dynamique.module';
// import { PaiementModule } from './paiement_user_a_es/paiement.module';
// import { ExpertSanteModule } from './user_etablissement_sante/expert-sante.module';
// import { GestionUtilisateurModule } from './administrateur/Gest_utilisateurs/gestion_utilisateur.module';
// import { EtablissementSanteModule } from './localisation_etablissement_sante/etablissement_sante.module';
// import { InvitationModule } from './invitations/invitation.module';

// @Module({
  
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DATABASE_HOST,
//       port: Number(process.env.DATABASE_PORT),
//       username: process.env.DATABASE_USER,
//       password: process.env.DATABASE_PASSWORD,
//       database: process.env.DATABASE_NAME,
//       synchronize: false,
//       logging: false,
//       autoLoadEntities: true,
//       ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
//     }),
    
//       UserModule, 
//       AuthModule, 
//       ImageModule, 

//   AdministrateurModule,
//   GestionUtilisateurModule,
//   InvitationModule,

//   ListeNumeroEtablissementSanteModule,
//   CloudinaryModule,
//   AnnonceModule,

//   ThematiqueDiscussionModule,
//   FirebaseModule,
//   TransactionFraisModule,

//   TransactionInterneModule,
//   EtablissementSanteModule, 
//   UserEtablissementSante,

//   UserEtablissementSanteModule,
//   QrDynamiqueModule,
//   PaiementModule,

//   AdministrateurModule,
//   PaiementModule,
//   ExpertSanteModule
//   ],

// })
// export class AppModule {}
// console.log('📌 Connexion à PostgreSQL avec URL :', process.env.DB_HOST);


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
// import { UserEtablissementSante } from './user_etablissement_sante/entities/user-etablissement-sante.entity';
// import { UserEtablissementSanteModule } from './user_etablissement_sante/user-etablissement-sante.module';
// import { QrDynamiqueModule } from './qr-dynamique_user_es/qr-dynamique.module';
// import { PaiementModule } from './paiement_user_a_es/paiement.module';
// import { ExpertSanteModule } from './user_etablissement_sante/expert-sante.module';


// // ✅ transaction interne
// import { TransactionInterneModule } from './transaction-interne/transaction-interne.module';
// import { TransactionFraisModule } from './transaction-frais/transaction-frais.module';
// import { EtablissementSanteModule } from './localisation_etablissement_sante/etablissement_sante.module';
// import { InvitationModule } from './invitations/invitation.module';
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
//       // process.env.NODE_ENV !== 'production',
//       extra: process.env.DB_SSL === 'true'
//         ? { ssl: { rejectUnauthorized: false } }
//         : undefined,
//     }),
//       UserModule, 
//       AuthModule, 
//       ImageModule, 

//       AdministrateurModule,
//       GestionUtilisateurModule,
//       InvitationModule,

//       ListeNumeroEtablissementSanteModule,
//       CloudinaryModule,
//       AnnonceModule,

//       ThematiqueDiscussionModule,
//       FirebaseModule,
//       TransactionFraisModule,

//       TransactionInterneModule,
//       EtablissementSanteModule, 
//       UserEtablissementSante,

//       UserEtablissementSanteModule,
//       QrDynamiqueModule,
//       PaiementModule,

//       AdministrateurModule,
//       PaiementModule,
//       ExpertSanteModule

//   ],
// })
// export class AppModule {}
