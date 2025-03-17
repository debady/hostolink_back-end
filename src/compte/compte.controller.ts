// src/compte/compte.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CompteService } from './compte.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCompteDto } from './dto/compte.dto';
import { UpdateSoldeDto } from './dto/mise_a_jour_solde.dto';

@Controller('compte')
export class CompteController {
  constructor(private readonly compteService: CompteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCompteDto: CreateCompteDto) {
    console.log('Requête reçue pour créer un compte:', createCompteDto);
    return this.compteService.create(createCompteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.compteService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.compteService.findCompteById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('utilisateur/:id')
  findCompteByUser(@Param('id') id: string) {
    return this.compteService.findCompteByUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('etablissement/:id')
  findCompteByEtablissement(@Param('id') id: string) {
    return this.compteService.findCompteByEtablissement(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/solde')
  updateSolde(@Param('id') id: string, @Body() updateSoldeDto: UpdateSoldeDto) {
    return this.compteService.updateSolde(+id, updateSoldeDto.montant);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.compteService.remove(+id);
  }
}
