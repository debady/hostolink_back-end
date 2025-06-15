import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtAdminGuard, JwtAuthGuard } from './jwt-auth.guard';
import { JwtExpertGuard } from 'src/user_etablissement_sante/guards/jwt-expert.guard';
import { JwtEtablissementAuthGuard } from './jwt-etablissement.guard';
export declare class AnyAuthGuard implements CanActivate {
    private readonly jwtAuthGuard;
    private readonly jwtEtablissementAuthGuard;
    private readonly jwtExpertGuard;
    private readonly jwtAdminGuard;
    constructor(jwtAuthGuard: JwtAuthGuard, jwtEtablissementAuthGuard: JwtEtablissementAuthGuard, jwtExpertGuard: JwtExpertGuard, jwtAdminGuard: JwtAdminGuard);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
