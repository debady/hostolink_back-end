import { JwtService } from '@nestjs/jwt';
import { UserService } from '../utilisateur/user.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../utilisateur/entities/user.entity';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private configService;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService);
    validateUser(identifier: string, password: string): Promise<{
        user: User;
        access_token: string;
    }>;
}
