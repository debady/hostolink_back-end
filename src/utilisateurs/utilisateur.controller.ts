import { Controller, Put, Body, Param } from '@nestjs/common';
import { UtilisateurService } from './utilisateur.service';
import { UpdatePositionDto } from './dto/update-position.dto';

@Controller('utilisateurs')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  @Put(':id/position')
  async mettreAJourPosition(
  @Param('id') id_user: number,
  @Body() updatePositionDto: UpdatePositionDto,
 ) {
  return this.utilisateurService.mettreAJourPosition(
    id_user,
    updatePositionDto.lat, 
    updatePositionDto.lon
  );
}

}
