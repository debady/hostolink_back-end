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

// ✅ transaction interne
import { TransactionInterneModule } from './transaction-interne/transaction-interne.module';
import { TransactionFraisModule } from './transaction-frais/transaction-frais.module';

// ✅ Administrateur
import { AdministrateurModule } from './administrateur/administrateur.module';
import { GestionUtilisateurModule } from './administrateur/Gest_utilisateurs/gestion_utilisateur.module';
import { Administrateur } from './administrateur/entities/administrateur.entity';
import { SmsModule } from './sms/sms.module';
import { OtpService } from './code_verif_otp/otp.service';
import { NotificationsModule } from './notifications/notifications.module';


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
      entities: [User, Otp, Image, Administrateur], 
    }),

    UserModule, 
    AuthModule, 
    ImageModule, 
    AdministrateurModule,
    GestionUtilisateurModule,
    OtpModule, 
<<<<<<< HEAD
    SmsModule,
    NotificationsModule
=======
    SmsModule, 
    TransactionInterneModule, 
    TransactionFraisModule,
>>>>>>> dc839cd4a0201c68eb4c61c2f6da90826c73ff80
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