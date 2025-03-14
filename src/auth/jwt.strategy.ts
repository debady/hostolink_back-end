import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../utilisateur/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    const secretKey = configService.get<string>('JWT_SECRET');
    if (!secretKey) {
      throw new Error('JWT_SECRET is not defined in the environment variables.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  async validate(payload: { id_user: number }) {
    const user = await this.userService.findUserById(payload.id_user);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }
    return user; // ✅ L'utilisateur validé sera injecté dans les requêtes
  }
}
