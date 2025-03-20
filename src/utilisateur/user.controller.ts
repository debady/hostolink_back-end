import { Controller, Post, Body, BadRequestException, InternalServerErrorException, Get, UseGuards,  Req, 
  Patch, 
  UploadedFile, 
  UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CheckUserDto } from './dto/check-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { OtpService } from '../code_verif_otp/otp.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface AuthenticatedRequest extends Request {
  user: { id_user: string };
}

@Controller('api')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService
  ) {}

  // ✅ Vérification de l’existence de l'utilisateur
  @Post('check-user')
  async checkUser(@Body() checkUserDto: CheckUserDto) {
    if (!checkUserDto.identifier?.trim()) {
      throw new BadRequestException('L’identifiant est requis');
    }

    const exists = await this.userService.checkUserExistence(checkUserDto.identifier.trim());
    return { success: true, exists, identifier: checkUserDto.identifier.trim() };
  }

  // ✅ Création d'un utilisateur (sans mot de passe)
  @Post('register-user')
  async registerUser(@Body() checkUserDto: CheckUserDto) {
    try {
      const result = await this.userService.registerUser(checkUserDto.identifier.trim());
      return { success: result.success, id_user: result.id_user, message: result.message };
    } catch (error) {
      console.error('❌ Erreur register-user:', error);
      throw new InternalServerErrorException(error.message || "Erreur lors de l'inscription");
    }
  }

  // ✅ Définition du mot de passe après inscription
  @Post('define-password')
  async definePassword(@Body() registerUserDto: RegisterUserDto) {
    if (!registerUserDto.identifier?.trim() || !registerUserDto.password?.trim()) {
      throw new BadRequestException('Identifiant et mot de passe sont obligatoires');
    }

    try {
      const success = await this.userService.setUserPassword(
        registerUserDto.identifier.trim(),
        registerUserDto.password.trim()
      );

      if (!success) {
        throw new InternalServerErrorException("Échec de la mise à jour du mot de passe.");
      }

      return { success: true, message: 'Mot de passe défini avec succès' };
    } catch (error) {
      console.error("❌ Erreur define-password:", error);
      throw new InternalServerErrorException(error.message || "Erreur lors de la mise à jour du mot de passe");
    }
  }

  // ✅ Vérification du PIN de connexion
  @Post('verify-pin')
  async verifyPin(@Body() body: { identifier: string; pin: string }) {
    if (!body.identifier?.trim() || !body.pin?.trim()) {
      throw new BadRequestException('Identifiant et PIN requis');
    }

    try {
      const isValid = await this.userService.verifyUserPin(
        body.identifier.trim(), 
        body.pin.trim()
      );
      
      return isValid 
        ? { success: true, message: 'PIN valide' } 
        : { success: false, message: 'PIN incorrect' };
    } catch (error) {
      console.error("❌ Erreur verify-pin:", error);
      throw new InternalServerErrorException("Erreur lors de la vérification du PIN");
    }
  }

  // ✅ Vérification d'un OTP
  @Post('verify-otp')
  async verifyOtp(@Body() body: { identifier: string; otpCode: string }) {
    try {
      console.log(`📩 Vérification OTP pour ${body.identifier}`);
      
      const isValid = await this.userService.verifyConfirmationCode(
        body.identifier.trim(), 
        body.otpCode.trim()
      );
      
      if (isValid) { // ✅ Vérification correcte car `isValid` est un booléen
        await this.userService.updateUserVerificationStatus(body.identifier.trim());
        console.log(`✅ Compte vérifié pour ${body.identifier}`);
      }
      

      return isValid;
    } catch (error) {
      console.error("❌ Erreur verify-otp:", error);
      throw new InternalServerErrorException(error.message || "Erreur lors de la vérification de l'OTP");
    }
  }

  // ✅ Récupérer les infos de l'utilisateur connecté
  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: AuthenticatedRequest) {
    console.log(`📌 Récupération des infos utilisateur pour id_user : ${req.user.id_user}`);
    return this.userService.getUserById(req.user.id_user);
  }

  // ✅ Mise à jour du profil utilisateur avec gestion de l'image de profil
  @Patch('/update-profile')
  @UseGuards(JwtAuthGuard) // 🔒 Protège l’endpoint avec JWT
  @UseInterceptors(FileInterceptor('file')) // ✅ Intercepte le fichier uploadé
  async updateProfile(
    @Req() req: AuthenticatedRequest, 
    @Body() updateProfileDto: UpdateProfileDto, 
    @UploadedFile() file?: Express.Multer.File // ✅ Prend en charge le fichier
  ) {
    const id_user = req.user.id_user; // ✅ Récupération automatique de id_user via JWT
    console.log('🟢 Image reçue:', file ? file.originalname : 'Aucune image reçue');
    return await this.userService.updateUserProfile(id_user, updateProfileDto, file);
  }
}
