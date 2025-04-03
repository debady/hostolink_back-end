import { Controller, Post, Body, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../utilisateur/user.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // ✅ Connexion et génération du token JWT
  @Post('login')
  async login(@Body() body: { identifier: string; password: string }) {
    console.log(`🔐 Tentative de connexion pour l'identifiant : ${body.identifier}`);

    if (!body.identifier?.trim() || !body.password?.trim()) {
      console.warn(`❌ Identifiant ou mot de passe manquant : ${body.identifier}`);
      throw new BadRequestException('Identifiant et mot de passe requis');
    }

    try {
      const result = await this.authService.validateUser(body.identifier.trim(), body.password.trim());
    
      if (!result) {
        throw new BadRequestException('Identifiant ou mot de passe incorrect');
      }
    
      if (!result.access_token) {
        // Génération OTP uniquement si non vérifié
        await this.authService.sendOtpToUser(result.user);
        return {
          success: true,
          message: 'Un OTP vous a été envoyé. Veuillez valider pour finaliser la connexion.',
          compte_verifier: false,
        };
      }
    
      // ✅ Si tout est bon
      return {
        success: true,
        message: 'Connexion réussie',
        token: result.access_token,
        compte_verifier: true,
      };
    }
     catch (error) {
      console.error(`❌ Erreur lors de la connexion pour ${body.identifier}:`, error);
      throw new InternalServerErrorException('Erreur lors de la connexion');
    }
  }
}
