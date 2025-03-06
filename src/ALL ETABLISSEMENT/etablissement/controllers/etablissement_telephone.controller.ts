import { Controller, Post, Body, Get } from '@nestjs/common';
import { EtablissementTelephoneService } from '../services/etablissement_telephone.service';
import { CreateEtablissementTelephoneDto } from '../dto/create-etablissement-telephone .dto';


@Controller('etablissement-telephones')
export class EtablissementTelephoneController {
  constructor(
    private readonly etablissementTelephoneService: EtablissementTelephoneService,
  ) {}

  // Route pour créer un téléphone
  @Post()
  async create(@Body() createEtablissementTelephoneDto: CreateEtablissementTelephoneDto) {
    return this.etablissementTelephoneService.createEtablissementTelephone(createEtablissementTelephoneDto);
  }

  // Route pour récupérer tous les téléphones
  @Get()
  async getAll() {
    return this.etablissementTelephoneService.getAllTelephones();
  }
}
