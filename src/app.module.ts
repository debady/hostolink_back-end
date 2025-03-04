import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,  // ❌ NE PAS METTRE À TRUE EN PRODUCTION
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsRun: true,
      logging: process.env.NODE_ENV !== 'production', // ✅ Activer logs seulement en développement
      extra: {
        ssl: {
          rejectUnauthorized: false, // ✅ Accepte les certificats auto-signés
        },
      },
    }),
    UserModule,
    AuthModule,
    ImageModule,
  ],
})
export class AppModule {}

console.log('📌 Connexion à PostgreSQL avec URL :', process.env.DATABASE_URL);







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