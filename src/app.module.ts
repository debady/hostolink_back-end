import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASS ?? 'NGUESSAN',
      database: process.env.DB_NAME ?? 'hostolink_bd',
      entities: [User], 
      autoLoadEntities: true,

      synchronize: false,

      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsRun: true, 
      logging: true, 

    }),
    UserModule, 
  ],
})
export class AppModule {}
