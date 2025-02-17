import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'; // Assurez-vous du bon chemin
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // Change si tu es sur un autre serveur
      // host: 'localhost', // Change si tu es sur un autre serveur
      port: 5432, // Par défaut, PostgreSQL utilise ce port
      username: 'postgres', // Ton utilisateur PostgreSQL
      password: 'some', // Mets ton vrai mot de passe
      database: 'hostolink_bd', // Ta base de données
      autoLoadEntities: true,
      entities: [User], // On ajoute l'entité `User`
      synchronize: true, // Mettre à `false` en production
    }),
    UsersModule, // Ajoute le module des utilisateurs
  ],
})
export class AppModule {}
