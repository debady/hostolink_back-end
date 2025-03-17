import { 
  Controller, 
  Post, 
  Body, 
  BadRequestException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { UserService } from '../utilisateur/user.service';
import { MoyenEnvoiEnum } from './entities/otp.entity';

@Controller('api/otp')
export class OtpController {
  constructor(
      private readonly otpService: OtpService,
      private readonly userService: UserService
  ) {}

  // ✅ Générer un OTP
  @Post('generate')
async generateOtp(@Body() body: { identifier: string; moyen_envoyer: MoyenEnvoiEnum }) {
  if (!body.identifier?.trim()) {
    throw new BadRequestException("L'identifiant est requis");
  }

  try {
    console.log(`📩 Génération OTP pour ${body.identifier} via ${body.moyen_envoyer}`);

    // ✅ Normalisation de la valeur ENUM pour correspondre à PostgreSQL
    const moyenEnvoyerFormatted = body.moyen_envoyer.toLowerCase() as MoyenEnvoiEnum;

    await this.otpService.generateOtp(body.identifier.trim(), moyenEnvoyerFormatted);
    return { success: true, message: "OTP généré avec succès" };
  } catch (error) {
    console.error("❌ Erreur generate-otp:", error);
    throw new InternalServerErrorException(error.message || "Erreur lors de la génération de l'OTP");
  }
}


  // ✅ Vérifier un OTP
  @Post('verify')
  async verifyOtp(@Body() body: { identifier: string; otpCode: string }) {
      if (!body.identifier?.trim() || !body.otpCode?.trim()) {
          throw new BadRequestException("Identifiant et code OTP requis");
      }

      try {
          console.log(`📩 Vérification OTP pour ${body.identifier}`);
          const isValid = await this.otpService.verifyOtp(body.identifier.trim(), body.otpCode.trim());

          if (isValid.success) {
              await this.userService.updateUserVerificationStatus(body.identifier.trim());
              console.log(`✅ Compte vérifié pour ${body.identifier}`);
          }

          return isValid;
      } catch (error) {
          console.error("❌ Erreur verify-otp:", error);

          if (error instanceof BadRequestException) {
              throw error;
          }
          throw new InternalServerErrorException("Erreur lors de la vérification de l'OTP");
      }
  }
}
