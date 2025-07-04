import { DataSource, Repository } from 'typeorm';
import { UserEtablissementSante } from './entities/user-etablissement-sante.entity';
import { CodeVerifOtp } from './entities/code-verif-otp.entity';
import { CreateUserEtablissementDto } from './dto/create-user-etablissement.dto';
import { UpdateProfileEtablissementDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { RaisonSuppressionCompte } from './entities/raison-suppression.entity';
import { Image } from '../image/entities/image.entity';
import { EmailService } from 'src/utilisateur/email.service';
export declare class UserEtablissementSanteService {
    private readonly dataSource;
    private readonly userRepo;
    private readonly otpRepo;
    private readonly raisonRepo;
    private readonly userEtablissementRepo;
    private readonly imageRepo;
    private readonly emailService;
    private readonly revokedTokens;
    logout(token: string): {
        message: string;
    };
    isTokenRevoked(token: string): boolean;
    constructor(dataSource: DataSource, userRepo: Repository<UserEtablissementSante>, otpRepo: Repository<CodeVerifOtp>, raisonRepo: Repository<RaisonSuppressionCompte>, userEtablissementRepo: Repository<UserEtablissementSante>, imageRepo: Repository<Image>, emailService: EmailService);
    register(data: CreateUserEtablissementDto): Promise<{
        message: string;
    }>;
    generateOtp(user: UserEtablissementSante): Promise<void>;
    verifyOtp(email: string, code: string): Promise<{
        message: string;
        user: {
            id: number;
            nom: string;
            email: string;
            categorie: string;
        };
    }>;
    private createOrEnsureCompte;
    private createOrEnsureQrStatique;
    private createOrEnsureQrDynamique;
    private generateToken;
    getProfile(id: number): Promise<{
        image_profil: string | null;
        compte: any;
        qr_code_statique: any;
        qr_code_dynamique: any;
        id_user_etablissement_sante: number;
        nom: string;
        telephone: string;
        categorie: string;
        adresse: string;
        creatAt: Date;
        latitude: number;
        longitude: number;
        geom: any;
        specialites: string;
        email: string;
        mot_de_passe: string;
        compte_verifie: boolean;
        numero_wave: string;
        wave_verified: boolean;
        otps: CodeVerifOtp[];
        raisons: RaisonSuppressionCompte[];
        experts: import("./entities/expert_sante.entity").ExpertSante[];
        conversations: import("../Discussion_agent_client/conversations/entities/conversation.entity").Conversation[];
        fcm_token?: string;
    }>;
    private createOrReplaceQrDynamique;
    updateProfile(id: number, dto: UpdateProfileEtablissementDto): Promise<UserEtablissementSante>;
    regenerateOtp(identifiant: string): Promise<{
        message: string;
    }>;
    changePasswordWithOtp(dto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    deleteAccountWithReason(id: number, dto: DeleteAccountDto): Promise<{
        message: string;
    }>;
    uploadOrUpdateAvatar(idEtablissement: number, file: Express.Multer.File): Promise<{
        message: string;
        url: any;
    }>;
    findLastCreatedEtablissementId(): Promise<number | null>;
    findEtablissementByIdentifier(identifier: string): Promise<UserEtablissementSante | null>;
    getAllEmailsForEs(): Promise<string[]>;
    getAllTelephonesForEs(): Promise<string[]>;
    updateFcmToken(id: number, fcmToken: string): Promise<{
        message: string;
    }>;
    login(email: string, fcmToken?: string): Promise<{
        message: string;
    }>;
}
