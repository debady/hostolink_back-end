import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtablissementTelephoneService } from './etablissement_telephone.service';
import { EtablissementTelephone } from './entities/etablissement_telephone.entity';
import { EtablissementSanteModule } from './etablissement-sante.module';
import { EtablissementTelephoneController } from './etablissement_telephone.controller';
 // Importer le module

@Module({
  imports: [
    TypeOrmModule.forFeature([EtablissementTelephone]),
    EtablissementSanteModule,  // Importer le module EtablissementSante ici
  ],
  providers: [EtablissementTelephoneService],
  controllers: [EtablissementTelephoneController],  // Liste uniquement les contrôleurs ici
})
export class EtablissementTelephoneModule {}
