import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('🔐 Activation du guard JWT');
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err) {
      console.error('❌ Erreur d\'authentification :', err);
      throw new UnauthorizedException('Accès non autorisé. Token invalide ou expiré.');
    }

    if (!user) {
      console.warn('❌ Utilisateur non trouvé dans le JWT');
      throw new UnauthorizedException('Accès non autorisé. Token invalide ou expiré.');
    }

    console.log(`✅ Utilisateur authentifié : ${user.id_user}`);

    return user;
  }
}
