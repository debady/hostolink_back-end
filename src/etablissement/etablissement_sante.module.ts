import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Etablissement } from './entities/etablissement_sante.entity';
import { EtablissementController } from './etablissement_sante.controller';
import { EtablissementService } from './etablissement_sante.service';


@Module({
  imports: [TypeOrmModule.forFeature([Etablissement])],
  providers: [EtablissementService],
  controllers: [EtablissementController],
})
export class EtablissementModule {}
