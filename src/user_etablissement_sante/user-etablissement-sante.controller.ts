import { Controller, Post, Body, UseGuards, Get, Req, Patch, ConflictException, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { UserEtablissementSanteService } from './user-etablissement-sante.service';
import { CreateUserEtablissementDto } from './dto/create-user-etablissement.dto';
import { UpdateProfileEtablissementDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { JwtEtablissementAuthGuard } from 'src/auth/jwt-etablissement.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user_etablissement?: number; // Remplacez 'any' par le type réel de votre utilisateur si possible
}

@Controller('user-etablissement-sante')
export class UserEtablissementSanteController {


  constructor(
    private readonly userEtablissementSanteService: UserEtablissementSanteService,
    private readonly service: UserEtablissementSanteService) {}

  @Post('register')
  register(@Body() dto: CreateUserEtablissementDto) {
    return this.service.register(dto);
  }

  @Post('verify-otp')
  verify(@Body() body: { email: string; code: string }) {
    return this.service.verifyOtp(body.email, body.code);
  }

  @Post('login')
  async login(@Body() body: { email: string; fcm_token?: string }) {
    return this.service.login(body.email, body.fcm_token);
  }
  
  @UseGuards(JwtEtablissementAuthGuard)
  @Post('logout')
  async logout(@Req() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new BadRequestException('Token manquant');
    return this.service.logout(token);
  }

  @UseGuards(JwtEtablissementAuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    const id = req.user.id_user_etablissement_sante;
    

    return this.service.getProfile(id);
  }

  @UseGuards(JwtEtablissementAuthGuard)
  @Patch('update-profile')
  updateProfile(@Req() req: any, @Body() dto: UpdateProfileEtablissementDto) {
    const id = req.user.id_user_etablissement_sante;

    return this.service.updateProfile(id, dto);
  }

  @Post('otp/re-generate')
  async regenerateOtp(@Body('identifiant') identifiant: string) {
    if (!identifiant) throw new ConflictException('Identifiant requis');
    return this.service.regenerateOtp(identifiant);
  }


  @Patch('password')
  async changePassword(@Body() dto: UpdatePasswordDto) {
    return this.service.changePasswordWithOtp(dto);
  }

  @UseGuards(JwtEtablissementAuthGuard)
  @Delete('delete-account')
  async deleteAccount(
    @Req() req: any,
    @Body() dto: DeleteAccountDto,
  ) {
    const id = req.user.id_user_etablissement_sante;
    return this.service.deleteAccountWithReason(id, dto);
  }
  
  @UseInterceptors(FileInterceptor('image_profil'))
  @Post('avatar')
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    // Si connecté avec JWT
    const id =
      req.user?.id_user_etablissement_sante ??
      (await this.userEtablissementSanteService.findLastCreatedEtablissementId());
  
    if (!id) throw new BadRequestException('Impossible de déterminer l’établissement');
  
    return this.userEtablissementSanteService.uploadOrUpdateAvatar(id, file);
  }
  

  @UseGuards(JwtEtablissementAuthGuard)
  @UseInterceptors(FileInterceptor('image_profil'))
  @Post('upload-avatar')
  async uploadAvatarAuthenticated(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const id = req.user.id_user_etablissement_sante;
    if (!file) throw new BadRequestException('Aucun fichier envoyé');
    return this.userEtablissementSanteService.uploadOrUpdateAvatar(id, file);
  }

  // ✅ Récupérer tous les emails
  @Get('all-etablissement-emails')
  @UseGuards(JwtAuthGuard)
  async getAllEmailsForEs(@Req() req: AuthenticatedRequest) {
    return await this.userEtablissementSanteService.getAllEmailsForEs();
  }

  // ✅ Récupérer tous les téléphones
  @Get('all-etablissement-telephones')
  @UseGuards(JwtAuthGuard)
  async getAllTelephonesForEs(@Req() req: AuthenticatedRequest) {
    return await this.userEtablissementSanteService.getAllTelephonesForEs();
  }

  // ✅ Vérifier si un email ou numéro existe
  @Post('check-etablissement-exist')
  @UseGuards(JwtAuthGuard)
  async checkIdentifier(@Req() req: AuthenticatedRequest, @Body() body: { identifier: string }) {
    if (!body.identifier?.trim()) {
      throw new BadRequestException("Identifiant requis.");
    }

    const user_etablissement_sante = await this.userEtablissementSanteService.findEtablissementByIdentifier(body.identifier.trim());
    if (user_etablissement_sante) {
      return { success: true, message: "Identifiant trouvé", data: user_etablissement_sante };
    } else {
      return { success: false, message: "Identifiant non trouvé" };
    }

  }

  @UseGuards(JwtEtablissementAuthGuard)
  @Patch('update-fcm-token')
  async updateFcmToken(
    @Req() req: any,
    @Body() body: { fcm_token: string }
  ) {
    const id = req.user.id_user_etablissement_sante;
    return this.service.updateFcmToken(id, body.fcm_token);
  }
}
