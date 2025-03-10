import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    login(body: {
        identifier: string;
        password: string;
    }): Promise<{
        access_token: string;
    } | null>;
}
