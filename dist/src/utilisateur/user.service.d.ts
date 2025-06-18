import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Image } from 'src/image/entities/image.entity';
import { ImageService } from 'src/image/image.service';
import { CompteService } from 'src/compte/compte.service';
import { QrCodeService } from 'src/qr-code/qr-code.service';
import { MoyenEnvoiEnum, Otp } from './entities/otp.entity';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
export declare class UserService {
    private readonly userRepository;
    private readonly imageRepository;
    private readonly imageService;
    private readonly compteService;
    private readonly qrCodeService;
    private readonly otpRepository;
    private readonly emailService;
    private readonly smsService;
    private readonly utilisateurRepo;
    AuthService: any;
    constructor(userRepository: Repository<User>, imageRepository: Repository<Image>, imageService: ImageService, compteService: CompteService, qrCodeService: QrCodeService, otpRepository: Repository<Otp>, emailService: EmailService, smsService: SmsService, utilisateurRepo: Repository<User>);
    registerUser(identifier: string, code_invitation_utilise?: string): Promise<{
        success: boolean;
        id_user?: string;
        message: string;
    }>;
    setUserPassword(identifier: string, password: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserById(id_user: string): Promise<any>;
    generateOtp(identifier: string, moyen_envoyer: MoyenEnvoiEnum): Promise<{
        success: boolean;
        otp: string;
    }>;
    generateJwtToken(user: User): Promise<string>;
    verifyOtp(identifier: string, otpCode: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateUserProfile(id_user: string, updateProfileDto: UpdateProfileDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
    }>;
    findUserByIdentifier(identifier: string): Promise<User | null>;
    verifyConfirmationCode(identifier: string, code: string): Promise<boolean>;
    updateUserVerificationStatus(identifier: string): Promise<void>;
    verifyUserPin(identifier: string, pin: string): Promise<boolean>;
    generateAndSendOtp(user: User): Promise<void>;
    findUserByPhone(telephone: string): Promise<User>;
    verifyOtpAndRewardParrain(identifier: string, otpCode: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllEmails(): Promise<(string | undefined)[]>;
    getAllTelephones(): Promise<(string | undefined)[]>;
    updateFcmToken(id_user: string, fcm_token: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createFullUser(data: {
        email?: string;
        telephone?: string;
        mdp: string;
        nom?: string;
        prenom?: string;
        pays?: string;
        position?: {
            longitude: number;
            latitude: number;
        };
        fcm_token?: string;
        code_invitation_utilise?: string;
    }): Promise<{
        success: boolean;
        id_user?: string;
        message: string;
    }>;
    getLastOtpByIdentifier(identifier: string): Promise<{
        otp?: string;
        expires_at?: Date;
        success: boolean;
        message: string;
    }>;
}
