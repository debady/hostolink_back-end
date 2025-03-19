import { 
  Controller, 
  Post, 
  Body, 
  HttpException, 
  HttpStatus, 
  Get,
  UseGuards,
  Request,
  Param,
  UploadedFile,
  UseInterceptors,
  Delete,
  UnauthorizedException,
  Patch
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAdministrateurDto } from './dto/create-administrateur.dto';
import { AdministrateurService } from './administrateur.service';
import { LoginAdministrateurDto } from './dto/login-administrateur.dto';
import { JwtAdminGuard } from '../auth/jwt-auth.guard';

@Controller('administrateurs')
export class AdministrateurController {
  constructor(private readonly adminService: AdministrateurService) {}

  @Post('inscription')
  async inscrireAdmin(@Body() dto: CreateAdministrateurDto) {
    try {
      return await this.adminService.inscrireAdministrateur(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() dto: LoginAdministrateurDto) {
    try {
      return await this.adminService.connexionAdministrateur(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
  
  @Get('me')
  @UseGuards(JwtAdminGuard)
  getMe(@Request() req) {
    return req.user;
  }

  // ✅ Endpoint ajouté pour upload avatar
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar', { dest: './uploads' }))
  async uploadAvatar(
    @Param('id') id: number,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    try {
      return await this.adminService.uploadAvatarAdmin(id, avatar);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAdminGuard)
  async supprimerAdministrateur(@Param('id') id: number) {
    return this.adminService.supprimerAdministrateur(id);
  }

  @Delete(':id/supprimer')
  @UseGuards(JwtAdminGuard) // seul un super admin peut exécuter cette action
  async supprimerAdminParSuperAdmin(@Param('id') id: number, @Request() req) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }

    return this.adminService.supprimerAdministrateur(id);
  }

  @Patch(':id/statut')
  @UseGuards(JwtAdminGuard)
  async modifierStatutAdmin(
    @Param('id') id: number,
    @Body('statut') statut: string,
    @Request() req,
  ) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }
    return this.adminService.modifierStatutAdministrateur(id, statut);
  }

  @Patch(':id')
  @UseGuards(JwtAdminGuard)
  async modifierAdministrateur(
    @Param('id') id: number,
    @Body() dto: Partial<CreateAdministrateurDto>,
    @Request() req,
  ) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }
    return this.adminService.modifierAdministrateur(id, dto);
  }




}
