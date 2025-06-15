import { MoyenEnvoiEnum } from '../entities/otp.entity';
export declare class GenerateOtpDto {
    identifier: string;
    moyen_envoyer: MoyenEnvoiEnum;
}
export declare class VerifyOtpDto {
    identifier: string;
    otpCode: string;
    id_user?: string;
    id_user_etablissement_sante?: number;
}
