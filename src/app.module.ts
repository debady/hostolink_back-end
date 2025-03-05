import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';
import { PublicationModule } from './publication/publication.module';
import { CommentaireModule } from './commentaire/commentaire.module';
import { PartageModule } from './partage/partage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // ✅ Charge `.env` pour toute l'application
      envFilePath: '.env',  // ✅ Spécifie où est `.env`
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      username: process.env.DATABASE_USER ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'NGUESSAN',
      database: process.env.DATABASE_NAME ?? 'hostolink_bd',
      entities: [User],
      autoLoadEntities: true,
      synchronize: false,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsRun: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    ImageModule,
    PublicationModule,
    CommentaireModule,
    PartageModule,
  ],
})
export class AppModule {}

// ✅ Vérifie si `.env` est bien chargé
console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_KEY);
