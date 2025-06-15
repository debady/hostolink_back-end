import { Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';
import { User } from './entities/user.entity';
export declare class OtpCleanerService {
    private readonly otpRepository;
    private readonly userRepository;
    constructor(otpRepository: Repository<Otp>, userRepository: Repository<User>);
    deleteExpiredOtps(): Promise<void>;
    deleteUnverifiedUsers(): Promise<void>;
}
