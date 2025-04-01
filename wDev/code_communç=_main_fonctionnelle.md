// ------------LOCAL -----------------

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';  
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  try {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  
      forbidNonWhitelisted: true,  
      transform: true,  
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',  
    methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  if (process.env.SERVE_STATIC === 'true') {
    app.useStaticAssets(join(__dirname, '..', 'public'));
  }

  app.use(json());  
  app.use(urlencoded({ extended: true })); 

  app.enableCors({
    origin: '*', 
    methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  });

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, '0.0.0.0');

  console.log(`le server tourne bien sur le porte 🚀: http://localhost:${PORT}`);
  console.log('📌 Connexion à PostgreSQL avec URL :', process.env.DATABASE_NAME);

}catch (error) {
    console.error('❌ erreur lors du demarrage de l application', error);
    process.exit(1);
  }
}
bootstrap();


//  ----- config en ligne -------

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { NestExpressApplication } from '@nestjs/platform-express';

// async function bootstrap() {
//   try {
//     const app = await NestFactory.create<NestExpressApplication>(AppModule);

//     app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
//     app.enableCors({
//       origin: '*',
//       methods: ['GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'DELETE'],
//       allowedHeaders: ['Content-Type', 'Authorization'],
//       credentials: true,
//     });

//     const PORT = process.env.PORT || 10000;
//     await app.listen(PORT, '0.0.0.0');

//     console.log(`🚀 le Server Tourne sur le port : http://localhost:${PORT}`);
//   } catch (error) {
//     console.error('❌ erreur lors du demarrage de l application', error);
//     process.exit(1);
//   }
// }
// bootstrap();


------- 
// ---------------------LOCAL ---------------------
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



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

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
  }),
  UserModule,
  AuthModule,
  ImageModule,
  ListeNumeroEtablissementSanteModule,
  CloudinaryModule,
  AdministrateurModule,
  AnnonceModule,
  ThematiqueDiscussionModule,
  FirebaseModule,
  TransactionFraisModule,
  TransactionInterneModule

  // PublicationModule,
  // CommentaireModule,
  // PartageModule,
  // EtablissementSanteModule, 
  ],

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



---------------------------------
# # ✅ Connexion PostgreSQL sur Supabase via le pooler avec SSL activé
# DB_HOST=aws-0-eu-west-3.pooler.supabase.com
# DB_PORT=5432
# DB_NAME=postgres
# DB_USER=postgres.skwupmsitzsxukbmnkwv
# DB_PASSWORD=6640ywfeiQqiBMM5
# DB_SSL=true

# # ✅ Configuration de Cloudinary
# CLOUDINARY_CLOUD_NAME=dhrrk7vsd
# CLOUDINARY_API_KEY=197881586145143
# CLOUDINARY_API_SECRET=HEEz2vCv7MyxBRjCZScbXeUKgEw

# # ✅ Clé secrète pour JWT
# JWT_SECRET=MY_SECRET_KEY

# # config email
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=sohapigroupcommunication@gmail.com
# SMTP_PASSWORD=ljwi jest pcay slpw
# SMTP_FROM=noreply@sohapigroup.com

# # Clés API Vonage
# VONAGE_API_KEY=607d95e2
# VONAGE_API_SECRET=2yxhopCqAC9LSxYE
# VONAGE_SMS_SENDER=Vonage

# FIREBASE_CREDENTIAL_PATH=src/config1/hostolink-sante-firebase-adminsdk-fbsvc-10c3095eb0.json


# --------LOCAL-----------
Configuration de la base de données PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=NGUESSAN
DATABASE_NAME=hostolink_bd

Configuration de Cloudinary
CLOUDINARY_CLOUD_NAME=dhrrk7vsd
CLOUDINARY_API_KEY=197881586145143
CLOUDINARY_API_SECRET=HEEz2vCv7MyxBRjCZScbXeUKgEw

# Clé secrète pour JWT
JWT_SECRET=MY_SECRET_KEY 


# config email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sohapigroupcommunication@gmail.com
SMTP_PASSWORD=ljwi jest pcay slpw
SMTP_FROM=noreply@sohapigroup.com

# Clés API Vonage
VONAGE_API_KEY=607d95e2
VONAGE_API_SECRET=2yxhopCqAC9LSxYE
VONAGE_SMS_SENDER=Vonage

FIREBASE_CREDENTIAL_PATH=src\config1\hostolink-sante-firebase-adminsdk-fbsvc-10c3095eb0.json
