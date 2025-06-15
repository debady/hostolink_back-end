import { User } from '../../utilisateur/entities/user.entity';
export declare enum MoyenEnvoiEnum {
    SMS = "SMS",
    EMAIL = "email",
    TELEPHONE = "TELEPHONE"
}
export declare class Otp {
    id: number;
    user?: User;
    id_user_etablissement_sante: string | null;
    otp_code: string;
    moyen_envoyer: MoyenEnvoiEnum;
    expires_at: Date;
    is_valid: boolean;
}
