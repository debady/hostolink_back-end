import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      // host: 'localhost', // Change si tu es sur un autre serveur
      port: 5432, 
      username: 'postgres', 
      password: 'NGUESSAN', 
      database: 'hostolink_bd', 
      autoLoadEntities: true,
      entities: [User], // On ajoute l'entité `User`
      synchronize: true, // Mettre à `false` en production
    }),
    UsersModule,
    AuthModule, // Ajoute le module des utilisateurs
  ],
})
export class AppModule {}
