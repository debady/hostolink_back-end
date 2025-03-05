import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { EtablissementService } from '../services/etablissement.service';
import { CreateEtablissementDto } from '../dto/create-etablissement.dto';


@Controller('etablissements')
export class EtablissementController {
  constructor(private readonly etablissementService: EtablissementService) {}

  // ➤ Route pour ajouter un établissement en utilisant le DTO
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createEtablissement(@Body() createEtablissementDto: CreateEtablissementDto) {
    return this.etablissementService.createEtablissement(createEtablissementDto);
  }
}
