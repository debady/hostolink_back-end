import { UserService } from './user.service';
import { CheckUserDto } from './dto/check-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { OtpService } from '../otp/otp.service';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        id_user: number;
    };
}
export declare class UserController {
    private readonly userService;
    private readonly otpService;
    constructor(userService: UserService, otpService: OtpService);
    checkUser(checkUserDto: CheckUserDto): Promise<{
        success: boolean;
        exists: boolean;
        identifier: string;
    }>;
    registerUser(checkUserDto: CheckUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    definePassword(registerUserDto: RegisterUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyPin(body: {
        identifier: string;
        pin: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    generateOtp(body: {
        identifier: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOtp(body: {
        identifier: string;
        otpCode: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllUsers(): Promise<{
        success: boolean;
        users: import("./entities/user.entity").User[];
    }>;
    getMe(req: AuthenticatedRequest): Promise<import("./entities/user.entity").User | null>;
}
export {};
