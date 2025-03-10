import { User } from '../../user/entities/user.entity';
export declare class Otp {
    id: number;
    user: User;
    userId: number;
    otp_code: string;
    expires_at: Date;
    is_valid: boolean;
}
