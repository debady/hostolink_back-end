import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

// ✅ Modules principaux
import { AuthModule } from './auth/auth.module';
import { UserModule } from './utilisateur/user.module';
import { ImageModule } from './image/image.module';
import { CloudinaryModule } from './upload/cloudinary.module';
import { AdministrateurModule } from './administrateur/administrateur.module';
import { GestionUtilisateurModule } from './administrateur/Gest_utilisateurs/gestion_utilisateur.module';
import { InvitationModule } from './invitations/invitation.module';
import { AnnonceModule } from './annonce/annonce.module';
import { ListeNumeroEtablissementSanteModule } from './liste_etablissement/liste_numero_etablissement_sante.module';

// ✅ Santé & Paiement
import { EtablissementSanteModule } from './localisation_etablissement_sante/etablissement_sante.module';
import { UserEtablissementSanteModule } from './user_etablissement_sante/user-etablissement-sante.module';
import { ExpertSanteModule } from './user_etablissement_sante/expert-sante.module';
import { QrDynamiqueModule } from './qr-dynamique_user_es/qr-dynamique.module';
import { PaiementModule } from './paiement_user_a_es/paiement.module';

// ✅ Transactions
import { TransactionFraisModule } from './transaction-frais/transaction-frais.module';
import { TransactionInterneModule } from './transaction-interne/transaction-interne.module';

// ✅ Chat thématique
import { ThematiqueDiscussionModule } from './thematique_discussion/thematique_discussion.module';
import { FirebaseModule } from './thematique_discussion/firebase/firebase.module';

// ✅ Agent assistant (chat IA)
import { AgentAssistantModule } from './agent-assistant/agent-assistant.module';
import { QuestionsPredefiniesModule } from './Discussion_agent_client/questions_predefinies/questions_predefinies.module';
import { MessageAssistantClientModule } from './Discussion_agent_client/message_assistant_client/message_assistant_client.module';
import { ConversationsModule } from './Discussion_agent_client/conversations/conversations.module';
import { MessagesAssistantClientImageModule } from './Discussion_agent_client/messages_assistant_client_image/messages_assistant_client_image.module';
import { EmailModule } from './email/dreams-houses-email.module';
import { DocumentsIdentiteModule } from './documents_identite/documents_identite.module';

@Module({
  imports: [
    // ✅ Fichiers .env accessibles partout
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    // ✅ CRON et tâches planifiées
    ScheduleModule.forRoot(),

    // ✅ Connexion PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'hostolink_bd',
      synchronize: false, // ❗️mettre true UNIQUEMENT en dev
      logging: false,
      autoLoadEntities: true,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    }),

    // ✅ Modules fonctionnels
    AuthModule,
    UserModule,
    ImageModule,
    CloudinaryModule,
    AdministrateurModule,
    GestionUtilisateurModule,
    InvitationModule,
    AnnonceModule,
    ListeNumeroEtablissementSanteModule,
    EtablissementSanteModule,
    UserEtablissementSanteModule,
    ExpertSanteModule,
    QrDynamiqueModule,
    PaiementModule,
    TransactionFraisModule,
    TransactionInterneModule,
    ThematiqueDiscussionModule,
    FirebaseModule,
    AgentAssistantModule,
    QuestionsPredefiniesModule,
    MessageAssistantClientModule,
    ConversationsModule,
    MessagesAssistantClientImageModule,

    // dr-hses
    EmailModule,

    DocumentsIdentiteModule,
  ],
})
export class AppModule {}



// // // ---------------------LOCAL ---------------------
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
// // ✅ Message assistant client
// import { AgentAssistantModule } from './agent-assistant/agent-assistant.module';
// import { QuestionsPredefiniesModule } from './Discussion_agent_client/questions_predefinies/questions_predefinies.module';
// import { MessagesAssistantClientImageModule } from './Discussion_agent_client/messages_assistant_client_image/messages_assistant_client_image.module';
// import { MessageAssistantClientModule } from './Discussion_agent_client/message_assistant_client/message_assistant_client.module';
// import { ConversationsModule } from './Discussion_agent_client/conversations/conversations.module';

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
//       autoLoadEntities: true,
//       synchronize: false, 
//       logging:false,
//       entities: [__dirname + '/**/*.entity{.ts,.js}'],
//   }),
//   UserModule, 
//   AuthModule, 
//   ImageModule, 

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
//   ExpertSanteModule,

//   AgentAssistantModule,
//   QuestionsPredefiniesModule,
//   MessagesAssistantClientImageModule,
//   MessageAssistantClientModule,
//   ConversationsModule,
//   QuestionsPredefiniesModule,


//   ],

// })
// export class AppModule {}
// console.log('📌 Connexion à PostgreSQL avec URL :', process.env.DB_HOST);


// // // // ----------en ligne -----------------
// // 
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
// import { AgentAssistantModule } from './agent-assistant/agent-assistant.module';
// import { QuestionsPredefiniesModule } from './Discussion_agent_client/questions_predefinies/questions_predefinies.module';
// import { MessageAssistantClientModule } from './Discussion_agent_client/message_assistant_client/message_assistant_client.module';
// import { ConversationsModule } from './Discussion_agent_client/conversations/conversations.module';
// import { MessagesAssistantClientImageModule } from './Discussion_agent_client/messages_assistant_client_image/messages_assistant_client_image.module';
// import { ScheduleModule } from '@nestjs/schedule';
// import { DocumentsIdentiteModule } from './documents-identite/documents_identite.module';
// import { DocumentsIdentiteService } from './documents_identite/documents_identite.service';
// import { DocumentsIdentiteController } from './documents_identite/documents_identite.controller';

// @Module({
//   imports: [
//     ScheduleModule.forRoot(),
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
//       ExpertSanteModule,
//       AgentAssistantModule,

        
//       AgentAssistantModule,
//       QuestionsPredefiniesModule,
//       MessagesAssistantClientImageModule,
//       MessageAssistantClientModule,
//       ConversationsModule,
//       QuestionsPredefiniesModule,
    

//   ],
// })
// export class AppModule {}
