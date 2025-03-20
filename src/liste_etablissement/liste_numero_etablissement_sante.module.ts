import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListeNumeroEtablissementSanteService } from './liste_numero_etablissement_sante.service';
import { ListeNumeroEtablissementSanteController } from './liste_numero_etablissement_sante.controller';
import { ListeNumeroEtablissementSante } from './entities/liste_numero_vert_etablissement_sante.entity';
import { CloudinaryModule } from 'src/upload/cloudinary.module';


@Module({
  imports: [TypeOrmModule.forFeature([ListeNumeroEtablissementSante]),CloudinaryModule ],
  controllers: [ListeNumeroEtablissementSanteController],
  providers: [ListeNumeroEtablissementSanteService],
})
export class ListeNumeroEtablissementSanteModule {}







































