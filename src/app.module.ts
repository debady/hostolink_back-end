import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
  ],
  controllers: [],  
  providers: [],
})
export class AppModule {}
