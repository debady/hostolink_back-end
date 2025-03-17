// ---------------------LOCAL ---------------------
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';
import { PublicationModule } from './publication/publication.module';
import { CommentaireModule } from './commentaire/commentaire.module';
import { PartageModule } from './partage/partage.module';
import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import { EtablissementSanteModule } from './etablissement_sante/etablissement_sante.module';
import { Commentaire } from './commentaire/entities/commentaire.entity';
import { Otp } from './otp/entities/otp.entity';
import { Publication } from './publication/entities/publication.entity';
import { Partage } from './partage/entities/partage.entity';
import { Image } from './image/entities/image.entity';
// import { EtablissementSante } from './etablissement_sante/entities/etablissement_sante.entity';
import { QrCodeModule } from './qr-code/qr-code.module';
import { CompteModule } from './compte/compte.module';
import { TransactionFraisModule } from './transaction_frais/transaction_frais.module';
import { EtablissementModule,  } from './user_etablissement_sante/user_etablissement_sante.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true,envFilePath: '.env', }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'mdp_dev_sohapigroup',
      database: process.env.DATABASE_NAME || 'hostolink_bd',
      autoLoadEntities: false,
      // synchronize: true, 
      synchronize: false, 
      entities: [User, Commentaire,Otp,Publication,Partage,Image,
        // EtablissementSante,
      ], 
  }),
  EtablissementModule,
  UserModule,
  AuthModule,
  ImageModule,
  PublicationModule,
  CommentaireModule,
  PartageModule,
  // EtablissementSanteModule, 
  // EtablissementSanteModule,
   QrCodeModule, TransactionFraisModule,
    // EtablissementSanteModule
  ],
  // controllers: [TransactionController],
})

export class AppModule {}