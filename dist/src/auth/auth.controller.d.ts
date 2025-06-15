import { AuthService } from './auth.service';
import { UserService } from '../utilisateur/user.service';
import { LoginEtablissementDto } from 'src/user_etablissement_sante/dto/login-etablissement.dto';
import { CreateUserDto } from 'src/utilisateur/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    login(body: {
        identifier: string;
        password: string;
    }): Promise<{
        success: boolean;
        message: string;
        compte_verifier: boolean;
        token?: undefined;
    } | {
        success: boolean;
        message: string;
        token: string;
        compte_verifier: boolean;
    }>;
    loginEtablissement(dto: LoginEtablissementDto): Promise<{
        token: string;
        etablissement: any;
    }>;
    register(registerDto: CreateUserDto): Promise<{
        success: boolean;
        id_user?: string;
        message: string;
    }>;
}
