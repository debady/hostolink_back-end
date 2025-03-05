import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeEtablissementService } from './services/type-etablissement.service';
import { TypeEtablissementController } from './controllers/type-etablissement.controller';
import { TypeEtablissement } from './entities/type-etablissement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeEtablissement])],  // Assure-toi que l'entité est bien incluse ici
  controllers: [TypeEtablissementController],
  providers: [TypeEtablissementService],
})
export class TypeEtablissementModule {}
