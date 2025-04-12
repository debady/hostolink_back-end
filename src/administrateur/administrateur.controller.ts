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
  Patch,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAdministrateurDto } from './dto/create-administrateur.dto';
import { AdministrateurService } from './administrateur.service';
import { LoginAdministrateurDto } from './dto/login-administrateur.dto';
import { JwtAdminGuard } from '../auth/jwt-auth.guard';

@Controller('administrateurs')
export class AdministrateurController {
  constructor(
    private readonly administrateurService: AdministrateurService,
    private readonly adminService: AdministrateurService) {}

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
  async getMe(@Request() req) {
    return this.adminService.getAdminById(req.user.id_admin_gestionnaire);
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

  @Get()
  @UseGuards(JwtAdminGuard)
  async recupererAdmins(@Request() req) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }
    return this.adminService.recupererTousLesAdmins();
  }


  @Get(':id/details')
  @UseGuards(JwtAdminGuard)
  async afficherDetailsAdmin(
    @Param('id') id: number,
    @Request() req,
  ) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }
    return this.adminService.getAdminById(id);
  }


  @Patch(':id/mot-de-passe')
  @UseGuards(JwtAdminGuard)
  async modifierMotDePasse(
    @Param('id') id: number,
    @Body('nouveau_mot_de_passe') nouveauMotDePasse: string,
    @Request() req,
  ) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }

    return this.adminService.modifierMotDePasseAdmin(id, nouveauMotDePasse);
  }


  @Patch(':id/permissions')
  @UseGuards(JwtAdminGuard)
  async attribuerPermissions(
    @Param('id') id: number,
    @Body('permissions') permissions: Record<string, any>,
    @Request() req,
  ) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }

    return this.adminService.modifierPermissionsAdmin(id, permissions);
  }

  @Get('role/:role')
  @UseGuards(JwtAdminGuard)
  async rechercherAdminParRole(
    @Param('role') role: string,
    @Request() req,
  ) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }

    return this.adminService.rechercherParRole(role);
  }


  @UseGuards(JwtAdminGuard)
  @Post('crediter-utilisateur')
  async crediterUtilisateur(@Body() body: { id_user: string; montant: number }) {
    return this.adminService.crediterUtilisateur(body.id_user, body.montant);
  }
  

  @Post('crediter-etablissement')
  @UseGuards(JwtAdminGuard)
  async crediterEtablissement(
    @Body('id_etab') id: number,
    @Body('montant') montant: number,
  ) {
    if (!id || !montant) {
      throw new BadRequestException('ID et montant requis');
    }
    return this.administrateurService.crediterEtablissement(id, montant);
  }

  @Get('etablissements')
  @UseGuards(JwtAdminGuard)
  async getAllEtablissements() {
    return this.administrateurService.findAllEtablissements();
  }

  // Recharge utilisateur par identifiant
  @UseGuards(JwtAdminGuard)
  @Post('recharger-user')
  rechargerUser(@Request() req, @Body() body: { identifiant: string; montant: number }) {
    return this.adminService.rechargerUser(body.identifiant, body.montant, req.user.id_admin_gestionnaire);
  }
  
  @UseGuards(JwtAdminGuard)
  @Post('recharger-etablissement')
  rechargerEtablissement(@Request() req, @Body() body: { identifiant: string; montant: number }) {
    return this.adminService.rechargerEtablissement(body.identifiant, body.montant, req.user.id_admin_gestionnaire);
  }
  


}
