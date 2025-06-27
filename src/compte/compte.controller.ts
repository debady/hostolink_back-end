import { Controller, Get, Param } from '@nestjs/common';
import { CompteService } from './compte.service';

@Controller('comptes')
export class CompteController {
  constructor(private readonly compteService: CompteService) {}

  @Get('utilisateur/:id')
  async getUserCompte(@Param('id') id: string) {
    const compte = await this.compteService.getUserCompte(id);
    if (!compte) {
      return {
        success: false,
        message: 'Aucun compte trouvé pour cet utilisateur'
      };
    }
    return {
      success: true,
      data: compte
    };
  }

}