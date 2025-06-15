import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UserEtablissementSante } from '../user_etablissement_sante/entities/user-etablissement-sante.entity';
import { UserEtablissementSanteService } from 'src/user_etablissement_sante/user-etablissement-sante.service';
declare const JwtEtablissementStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtEtablissementStrategy extends JwtEtablissementStrategy_base {
    private configService;
    private readonly userRepo;
    private readonly userEtablissementService;
    constructor(configService: ConfigService, userRepo: Repository<UserEtablissementSante>, userEtablissementService: UserEtablissementSanteService);
    validate(req: Request, payload: {
        id: number;
    }): Promise<UserEtablissementSante | null>;
}
export {};
