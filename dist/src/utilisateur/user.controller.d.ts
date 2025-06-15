import { UserService } from './user.service';
import { CheckUserDto } from './dto/check-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MoyenEnvoiEnum } from './entities/otp.entity';
import { AuthService } from 'src/auth/auth.service';
interface AuthenticatedRequest extends Request {
    user: {
        id_user: string;
    };
}
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    registerUser(checkUserDto: CheckUserDto): Promise<{
        success: boolean;
        id_user: string | undefined;
        message: string;
    }>;
    definePassword(registerUserDto: RegisterUserDto): Promise<{
        success: boolean;
        message: string;
        debug: string | undefined;
    }>;
    generateOtp(body: {
        identifier: string;
        moyen_envoyer: MoyenEnvoiEnum;
    }): Promise<{
        success: boolean;
        message: string;
        moyen: MoyenEnvoiEnum.SMS | MoyenEnvoiEnum.TELEPHONE;
        otp: string;
    } | {
        success: boolean;
        message: string;
        moyen: MoyenEnvoiEnum.EMAIL;
        otp: string;
    }>;
    verifyPin(body: {
        identifier: string;
        pin: string;
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
    } | {
        success: boolean;
        message: string;
        token: string;
    }>;
    getMe(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: any;
    }>;
    updateProfile(req: AuthenticatedRequest, updateProfileDto: UpdateProfileDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllEmails(req: AuthenticatedRequest): Promise<(string | undefined)[]>;
    getAllTelephones(req: AuthenticatedRequest): Promise<(string | undefined)[]>;
    checkIdentifier(req: AuthenticatedRequest, body: {
        identifier: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/user.entity").User;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
    updateFcmToken(req: any, fcm_token: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
export {};
