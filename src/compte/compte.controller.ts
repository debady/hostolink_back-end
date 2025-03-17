// Contrôleur Compte
import { Controller, Get, Param } from '@nestjs/common';
import { CompteService } from './compte.service';

@Controller('comptes')
export class CompteController {
  constructor(private readonly compteService: CompteService) {}

  @Get('utilisateur/:id')
  findCompteByEtablissement(@Param('id') id: string) {
    return this.compteService.findCompteByEtablissement(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.compteService.findCompteById(+id);
  }
}
