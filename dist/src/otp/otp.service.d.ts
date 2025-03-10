import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Otp } from '../otp/entities/otp.entity';
export declare class OtpService {
    private readonly otpRepository;
    private readonly userRepository;
    constructor(otpRepository: Repository<Otp>, userRepository: Repository<User>);
    generateOtp(identifier: string): Promise<{
        success: boolean;
        otp: string;
    }>;
    verifyOtp(identifier: string, otpCode: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
