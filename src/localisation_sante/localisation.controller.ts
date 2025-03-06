import { Controller, Get, Param } from '@nestjs/common';
import { LocalisationService } from './localisation.service';

@Controller('localisations')
export class LocalisationController {
  constructor(private readonly localisationService: LocalisationService) {}

  // ✅ Récupérer toutes les localisations
  @Get()
  findAll() {
    return this.localisationService.findAll();
  }

  // ✅ Récupérer une localisation spécifique
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.localisationService.findOne(id);
  }
}
