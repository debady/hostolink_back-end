import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserEtablissementSanteService } from './user-etablissement-sante.service';
import { CreateUserEtablissementDto } from './dto/create-user-etablissement.dto';

@Controller('user-etablissement-sante')
export class UserEtablissementSanteController {
  constructor(private readonly service: UserEtablissementSanteService) {}

  @Post()
  create(@Body() dto: CreateUserEtablissementDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(+id);
  }
}
