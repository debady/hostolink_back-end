import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalisationService } from './localisation.service';
import { LocalisationController } from './localisation.controller';
import { Localisation } from './entities/localisation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Localisation])],
  controllers: [LocalisationController],
  providers: [LocalisationService],
  exports: [LocalisationService],  // Permet d'utiliser LocalisationService dans d'autres modules
})
export class LocalisationModule {}
