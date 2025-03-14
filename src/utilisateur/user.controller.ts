import { 
  Controller, 
  Post, 
  Body, 
  BadRequestException, 
  InternalServerErrorException, 
  Get, 
  UseGuards,
  Req 
} from '@nestjs/common';
import { UserService } from './user.service';
import { CheckUserDto } from './dto/check-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { OtpService } from '../code_verif_otp/otp.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { id_user: number };
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
    if (!checkUserDto.identifier?.trim()) {
      throw new BadRequestException('L’identifiant est requis');
    }

    try {
      return await this.userService.registerUser(checkUserDto.identifier.trim());
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
      const isValid = await this.userService.verifyUserPin(body.identifier.trim(), body.pin.trim());
      return isValid 
        ? { success: true, message: 'PIN valide' } 
        : { success: false, message: 'PIN incorrect' };
    } catch (error) {
      console.error("❌ Erreur verify-pin:", error);
      throw new InternalServerErrorException("Erreur lors de la vérification du PIN");
    }
  }
  

  // ✅ Générer un OTP
  @Post('generate-otp')
  async generateOtp(@Body() body: { identifier: string }) {
    if (!body.identifier?.trim()) {
      throw new BadRequestException("L'identifiant est requis");
    }

    try {
      await this.otpService.generateOtp(body.identifier.trim());
      return { success: true, message: "OTP généré avec succès" };
    } catch (error) {
      console.error("❌ Erreur generate-otp:", error);
      throw new InternalServerErrorException(error.message || "Erreur lors de la génération de l'OTP");
    }
  }

  // ✅ Vérifier un OTP
  @Post('verify-otp')
  async verifyOtp(@Body() body: { identifier: string; otpCode: string }) {
    if (!body.identifier?.trim() || !body.otpCode?.trim()) {
      throw new BadRequestException("Identifiant et code OTP requis");
    }

    try {
      return await this.otpService.verifyOtp(body.identifier.trim(), body.otpCode.trim());
    } catch (error) {
      console.error("❌ Erreur verify-otp:", error);
      throw new InternalServerErrorException(error.message || "Erreur lors de la vérification de l'OTP");
    }
  }

  // ✅ Récupérer les infos de l'utilisateur connecté
  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.userService.getUserById(req.user.id_user);
  }
}