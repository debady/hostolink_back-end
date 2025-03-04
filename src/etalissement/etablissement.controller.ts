import { Controller, Get, Post, Put, Delete, Body, Query, Param } from '@nestjs/common';
import { EtablissementService } from './etablissement.service';
import { CreateEtablissementDto } from './dto/create-etablissement.dto';
import { UpdateEtablissementDto } from './dto/update-etablissement.dto';
import { SearchEtablissementDto } from './dto/search-etablissement.dto';

@Controller('etablissements')
export class EtablissementsController {
  etablissementService: any;
  constructor(private readonly etablissementsService: EtablissementService) {}

  // ➤ Route pour créer un établissement
  @Post()
  async create(@Body() createEtablissementDto: CreateEtablissementDto) {
    return this.etablissementService.create(createEtablissementDto);
  }

  // ➤ Route pour récupérer tous les établissements
  @Get()
  async getAll() {
    return this.etablissementService.getAll();
  }

  // ➤ Route pour récupérer les établissements proches d'une position
  @Get('proches')
  async getNearby(@Query() query: SearchEtablissementDto) {
    return this.etablissementService.getNearbyEtablissements(query.lat, query.lon, query.radius);
  }

  // ➤ Route pour mettre à jour un établissement
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateEtablissementDto: UpdateEtablissementDto) {
    return this.etablissementService.update(id, updateEtablissementDto);
  }

  // ➤ Route pour supprimer un établissement
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.etablissementService.delete(id);
  }
}
