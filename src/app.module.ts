import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtablissementSante } from './etablissement/entities/etablissement_sante.entity';
import { Localisation } from './etablissement/entities/localisation.entity';
import { EtablissementTelephone } from './etablissement/entities/etablissement_telephone.entity';
import { EtablissementService } from './etablissement/services/etablissement.service';
import { EtablissementController } from './etablissement/controllers/etablissement.controller';
import { TypeEtablissementController } from './etablissement/controllers/type-etablissement.controller';
import { TypeEtablissementService } from './etablissement/services/type-etablissement.service';
import { TypeEtablissement } from './etablissement/entities/type-etablissement.entity';
import { EtablissementTelephoneModule } from './etablissement/etablissement_telephone.module';
import { EtablissementSanteModule } from './etablissement/etablissement-sante.module';
 // Module ajouté ici

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'NGUESSAN',
      database: 'hostolink_bd',
      entities: [EtablissementSante, TypeEtablissement, Localisation, EtablissementTelephone], 
      synchronize: true,
    }),
    TypeOrmModule.forFeature([EtablissementSante, TypeEtablissement, Localisation, EtablissementTelephone]),
    EtablissementTelephoneModule,  // Module pour les téléphones
    EtablissementSanteModule, // Correctement importé ici
  ],
  controllers: [EtablissementController, TypeEtablissementController],  // Contrôleurs ici
  providers: [EtablissementService, TypeEtablissementService],
})
export class AppModule {}
