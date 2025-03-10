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
import { EtablissementSanteModule } from './etablissement_sante/etablissement_sante.module';
import { Publication } from './publication/entities/publication.entity';
import { Commentaire } from './commentaire/entities/commentaire.entity';
import { Otp } from './otp/entities/otp.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true,envFilePath: '.env', }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'NGUESSAN',
      database: process.env.DATABASE_NAME || 'hostolink_bd',
      entities: [User, Commentaire, Publication, Otp],
      synchronize: false, 
      autoLoadEntities: true,

  }),
  UserModule,
  AuthModule,
  ImageModule,
  PublicationModule,
  CommentaireModule,
  PartageModule,
  EtablissementSanteModule, 
    EtablissementSanteModule
  ],
})

export class AppModule {}