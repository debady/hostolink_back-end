import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // ✅ Connexion et génération du token JWT
  @Post('login')
  async login(@Body() body: { identifier: string; password: string }) {
    if (!body.identifier || !body.password) {
      throw new BadRequestException('Identifiant et mot de passe requis');
    }

    return await this.authService.validateUser(body.identifier, body.password);
  }
}
