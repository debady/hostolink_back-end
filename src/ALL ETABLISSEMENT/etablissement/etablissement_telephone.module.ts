import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtablissementTelephone } from './entities/etablissement_telephone.entity';
import { EtablissementTelephoneService } from './services/etablissement_telephone.service';
import { EtablissementTelephoneController } from './controllers/etablissement_telephone.controller';
import { EtablissementSanteModule } from './etablissement-sante.module';
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
