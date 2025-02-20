// EMPECHER LA CONNEXION NON AUTORISER PAS JWT


import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Accès refusé : Token manquant.');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload; // ✅ Ajoute l'utilisateur dans `request`
      return true;
    } catch (error) {
      throw new UnauthorizedException('Accès refusé : Token invalide.');
    }
  }
}
