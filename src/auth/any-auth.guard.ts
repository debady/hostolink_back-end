import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAdminGuard, JwtAuthGuard } from './jwt-auth.guard';
import { JwtExpertGuard } from 'src/user_etablissement_sante/guards/jwt-expert.guard';
import { JwtEtablissementAuthGuard } from './jwt-etablissement.guard';


@Injectable()
export class AnyAuthGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly jwtEtablissementAuthGuard: JwtEtablissementAuthGuard,
    private readonly jwtExpertGuard: JwtExpertGuard,
    private readonly jwtAdminGuard: JwtAdminGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const guards = [
      this.jwtAuthGuard,
      this.jwtEtablissementAuthGuard,
      this.jwtExpertGuard,
      this.jwtAdminGuard,
    ];

    // Tester chaque guard - si l'un d'eux passe, accorder l'accès
    for (const guard of guards) {
      try {
        const result = await guard.canActivate(context);
        if (result) {
          return true;
        }
      } catch (error) {
        // Continuer avec le prochain guard si celui-ci échoue
        continue;
      }
    }

    // Si aucun guard ne passe, refuser l'accès
    return false;
  }
}