import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Localisation } from './etablissement/entities/localisation.entity';
import { LocalisationModule } from './etablissement/localisation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',  
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'NGUESSAN',
      database: 'hostolink_bd',
      entities: [Localisation], 
      synchronize: true, 
    }),

    LocalisationModule,
  ],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log("✅ Connexion à la base de données réussie !");
  }
}
