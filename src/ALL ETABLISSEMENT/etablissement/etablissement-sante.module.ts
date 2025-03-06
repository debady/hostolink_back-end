import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtablissementSante } from './entities/etablissement_sante.entity';  // L'entité

@Module({
  imports: [
    TypeOrmModule.forFeature([EtablissementSante]),  // On importe l'entité ici
  ],
  providers: [EtablissementSante],  // Ajout du service
  exports: [TypeOrmModule],  // Assure-toi d'exporter TypeOrmModule si nécessaire
})
export class EtablissementSanteModule {}
