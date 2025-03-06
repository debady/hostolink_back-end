import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeEtablissement } from './entities/type-etablissement.entity';
import { TypeEtablissementController } from './type-etablissement.controller';
import { TypeEtablissementService } from './type-etablissement.service';


@Module({
  imports: [TypeOrmModule.forFeature([TypeEtablissement])],  // Assure-toi que l'entité est bien incluse ici
  controllers: [TypeEtablissementController],
  providers: [TypeEtablissementService],
})
export class TypeEtablissementModule {}
