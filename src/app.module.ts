import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
import { ConfigModule } from '@nestjs/config';
import { EtablissementSanteModule } from './etablissement_sante/etablissement_sante.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'NGUESSAN',
      database: process.env.DATABASE_NAME || 'hostolink_bd',
      autoLoadEntities: true,
      synchronize: true, 
    }),
    EtablissementSanteModule, 
=======
import { Localisation } from './localisation_sante/entities/localisation.entity';
import { LocalisationModule } from './localisation_sante/localisation.module';

@Module({
  imports: [
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
>>>>>>> 901cc4c397c4d8b3438d646f31114b58f6255dca
  ],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    console.log("✅ Connexion à la base de données réussie !");
  }
}
