import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';
import { PublicationModule } from './publication/publication.module';
import { CommentaireModule } from './commentaire/commentaire.module';
import { PartageModule } from './partage/partage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsRun: true,
      logging: process.env.NODE_ENV !== 'production',
      extra: process.env.DB_SSL === 'true'
        ? { ssl: { rejectUnauthorized: false } }  // ✅ Supprime l'utilisation du fichier .pem
        : undefined,
    }),
    UserModule,
    AuthModule,
    ImageModule,
    PublicationModule,
    CommentaireModule,
    PartageModule,
=======
import { EtablissementSante } from './etablissement/entities/etablissement_sante.entity';
import { Localisation } from './etablissement/entities/localisation.entity';
import { EtablissementTelephone } from './etablissement/entities/etablissement_telephone.entity';
import { EtablissementService } from './etablissement/services/etablissement.service';
import { EtablissementController } from './etablissement/controllers/etablissement.controller';
import { TypeEtablissementController } from './etablissement/controllers/type-etablissement.controller';
import { TypeEtablissementService } from './etablissement/services/type-etablissement.service';
import { TypeEtablissement } from './etablissement/entities/type-etablissement.entity';
import { EtablissementTelephoneModule } from './etablissement/etablissement_telephone.module';
import { EtablissementSanteModule } from './etablissement/etablissement-sante.module';
 // Module ajouté ici

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'NGUESSAN',
      database: 'hostolink_bd',
      entities: [EtablissementSante, TypeEtablissement, Localisation, EtablissementTelephone], 
      synchronize: true,
    }),
    TypeOrmModule.forFeature([EtablissementSante, TypeEtablissement, Localisation, EtablissementTelephone]),
    EtablissementTelephoneModule,  // Module pour les téléphones
    EtablissementSanteModule, // Correctement importé ici
>>>>>>> c2809185ef9fdef4bdce26e64315234f28dd58ac
  ],
  controllers: [EtablissementController, TypeEtablissementController],  // Contrôleurs ici
  providers: [EtablissementService, TypeEtablissementService],
})
export class AppModule {}
<<<<<<< HEAD
console.log('📌 Connexion à PostgreSQL avec URL :', process.env.DB_HOST);






// Vérifie que la variable Cloudinary est bien chargée
// console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY);
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { UserModule } from './user/user.module';
// import { User } from './user/entities/user.entity';
// import { AuthModule } from './auth/auth.module';
// import { ImageModule } from './image/image.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,  // ✅ Charge `.env` pour toute l'application
//       envFilePath: '.env',  // ✅ Spécifie où est `.env`
//     }),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DATABASE_HOST ?? 'localhost',
//       port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
//       username: process.env.DATABASE_USER ?? 'postgres',
//       password: process.env.DATABASE_PASSWORD ?? 'NGUESSAN',
//       database: process.env.DATABASE_NAME ?? 'hostolink_bd',
//       entities: [User],
//       autoLoadEntities: true,
//       synchronize: false,
//       migrations: [__dirname + '/migrations/*{.ts,.js}'],
//       migrationsRun: true,
//       logging: true,
//     }),
//     UserModule,
//     AuthModule,
//     ImageModule,
//   ],
// })
// export class AppModule {}

// // console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY);
=======
>>>>>>> c2809185ef9fdef4bdce26e64315234f28dd58ac
