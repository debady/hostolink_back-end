import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateEtablissementDto } from './dto/create-etablissement.dto';
import { EtablissementService } from './etablissement.service';


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
