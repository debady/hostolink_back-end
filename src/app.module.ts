// ---------------------LOCAL ---------------------

import { UserModule } from './utilisateur/user.module'; 
import { User } from './utilisateur/entities/user.entity'; 
import { AuthModule } from './auth/auth.module'; 
import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { ConfigModule } from '@nestjs/config'; 
import { Otp } from './code_verif_otp/entities/otp.entity'; 
import { NotificationsModule } from './notifications/notifications.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    NotificationsModule,
    // EtablissementSanteModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'NGUESSAN',
      database: process.env.DATABASE_NAME || 'hostolink_bd',
      autoLoadEntities: false, 
      synchronize: false, 
      entities: [User, Otp], 
    }),

    UserModule, 
    AuthModule, 

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