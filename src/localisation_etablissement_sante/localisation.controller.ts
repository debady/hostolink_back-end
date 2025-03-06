import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateLocalisationDto } from './dto/create-localisation.dto';
import { LocalisationService } from 'src/localisation_sante/localisation.service';

@Controller('localisations')  // ✅ Vérifie que le chemin est bien '/localisations'
export class LocalisationController {
  constructor(private readonly localisationService: LocalisationService) {}

  @Post()  // ✅ Vérifie que la méthode POST est bien définie
  async createLocalisation(@Body() createLocalisationDto: CreateLocalisationDto) {
    return this.localisationService.createLocalisation(createLocalisationDto);
  }

  @Get()  // ✅ Vérifie que la méthode GET est bien définie pour récupérer les données
  async getAllLocalisations() {
    return this.localisationService.getAllLocalisations();
  }
}
