import { Controller, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { GestUtilisateurService } from './gest_utilisateur.service';
import { UpdateUserDto } from './dto/update-user.dto';  // ✅ Importer celui d'admin et PAS celui de `utilisateur/dto`

@Controller('/admin/utilisateurs')
export class GestUtilisateurController {
  constructor(private readonly gestUtilisateurService: GestUtilisateurService) {}

  @Get()
  findAll() {
    return this.gestUtilisateurService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gestUtilisateurService.findOne(id);
  }
  @Patch(':id/ban')
  updateBanReason(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto  // ✅ Vérifier que ce DTO est utilisé
  ) {
    return this.gestUtilisateurService.updateBanReason(id, updateUserDto);
  }
  


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gestUtilisateurService.remove(id);
  }
}
