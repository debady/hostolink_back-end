import { JwtService } from '@nestjs/jwt';
import { UserService } from '../utilisateur/user.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../utilisateur/entities/user.entity';
import { UserEtablissementSante } from 'src/user_etablissement_sante/entities/user-etablissement-sante.entity';
import { Repository } from 'typeorm';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private configService;
    private userRepo;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService, userRepo: Repository<UserEtablissementSante>);
    generateJwtTokenFromUser(user: User): Promise<string>;
    validateUser(identifier: string, password: string): Promise<{
        user: User;
        access_token: string | null;
    }>;
    sendOtpToUser(user: User): Promise<void>;
    validateUserEtablissementSante(identifiant: string, password: string): Promise<any>;
    login(user: any): Promise<string>;
    loginEtablissement(user: any): Promise<string>;
    register(identifier: string, code_invitation_utilise?: string): Promise<{
        success: boolean;
        id_user?: string;
        message: string;
    }>;
}
