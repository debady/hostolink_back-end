import { Controller, Post, Body } from '@nestjs/common';
import { TypeEtablissementService } from './type-etablissement.service';
import { CreateTypeEtablissementDto } from './dto/create-type-etablissement';


@Controller('type-etablissement')
export class TypeEtablissementController {
  constructor(private readonly typeEtablissementService: TypeEtablissementService) {}

  @Post()
  async createType(@Body() createTypeDto: CreateTypeEtablissementDto) {
    return await this.typeEtablissementService.createTypeEtablissement(createTypeDto);
  }
}
