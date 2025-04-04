import { Controller, Get, Patch, Delete, Param, Body, BadRequestException, Post } from '@nestjs/common';
import { GestUtilisateurService } from './gest_utilisateur.service';
import { UpdateUserDto } from './dto/update-user.dto';  // ✅ Importer celui d'admin et PAS celui de `utilisateur/dto`
import { ActivationUserDto } from './dto/activation-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CheckUserDto } from 'src/utilisateur/dto/check-user.dto';

@Controller('/admin/utilisateurs')
export class GestUtilisateurController {
  constructor(private readonly gestUtilisateurService: GestUtilisateurService) {}

    // ✅ Vérification de l’existence de l'utilisateur
    @Post('check-user')
    async checkUser(@Body() checkUserDto: CheckUserDto) {
      if (!checkUserDto.identifier?.trim()) {
        throw new BadRequestException('L’identifiant est requis');
      }
  
      const exists = await this.gestUtilisateurService.checkUserExistence(checkUserDto.identifier.trim());
      return { success: true, exists, identifier: checkUserDto.identifier.trim() };
    }

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

  @Patch(':id/activation')
  async updateActivation(
    @Param('id') id: string,
    @Body() activationUserDto: ActivationUserDto
  ) {
    return this.gestUtilisateurService.updateActivation(id, activationUserDto);
  }

  @Patch(':id/reset-password')
  async resetPassword(
    @Param('id') id: string,
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    return this.gestUtilisateurService.resetPassword(id, resetPasswordDto);
  }
}
