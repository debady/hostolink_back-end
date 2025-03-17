import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private configService;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService);
    validateUser(identifier: string, password: string): Promise<{
        access_token: string;
    } | null>;
    generateStaticQrCodeToken(payload: any): string;
    generateDynamicQrCodeToken(payload: any): string;
    verifyQrCodeToken(token: string, isDynamic?: boolean): any;
}
