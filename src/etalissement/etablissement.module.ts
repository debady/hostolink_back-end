 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etablissement } from './entities/etablissement.entity';
import { EtablissementsController } from './etablissement.controller';
import { EtablissementService } from './etablissement.service';

@Module({
  imports: [TypeOrmModule.forFeature([Etablissement])],
  controllers: [EtablissementsController],
  providers: [EtablissementService],
  exports: [EtablissementService]
})
export class EtablissementModule {}
