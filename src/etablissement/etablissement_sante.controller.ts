import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { EtablissementService } from './etablissement_sante.service';
import { GetEtablissementsProchesDto } from './dto/get-etablissements-proche.dto';
import { SearchEtablissementDto } from './dto/search-etablissement.dto';
import { ItineraireDto } from './dto/etablissement-itineraire.dto';


@Controller('etablissements')
export class EtablissementController {
  constructor(private readonly etablissementService: EtablissementService) {}

  //récupérer les établissements proches d'un utilisateur
  @Get('proches')
  @UsePipes(new ValidationPipe({ transform: true })) // ✅ Transforme les valeurs en nombres
  async getEtablissementsProches(@Query() query: GetEtablissementsProchesDto) {
    return this.etablissementService.getEtablissementsProches(query.lat, query.lon, query.distance);
  }
   
  //rechercher un établissement par son nom
  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchEtablissements(@Query() query: SearchEtablissementDto) {
    return this.etablissementService.searchEtablissements(query.nom);
  }

  // récupérer l'itinéraire vers un établissement
  @Get('itineraire')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getItineraire(@Query() query: ItineraireDto) {
    return this.etablissementService.getItineraire(query.lat, query.lon, query.id_etablissement);
  }

}
