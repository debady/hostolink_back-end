import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Localisation } from './entities/localisation.entity';
import { LocalisationController } from 'src/localisation_sante/localisation.controller';
import { LocalisationService } from 'src/localisation_sante/localisation.service';



@Module({
  imports: [TypeOrmModule.forFeature([Localisation])],
  controllers:  [LocalisationController], // ✅ Vérifie que le contrôleur est bien ajouté ici
  providers: [LocalisationService],
})
export class LocalisationModule {}
