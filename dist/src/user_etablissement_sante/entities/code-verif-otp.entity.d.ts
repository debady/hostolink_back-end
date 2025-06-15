import { UserEtablissementSante } from './user-etablissement-sante.entity';
export declare class CodeVerifOtp {
    id: number;
    otp_code: string;
    expires_at: Date;
    is_valid: boolean;
    userEtablissementSante: UserEtablissementSante;
    moyen_envoyer: string;
}
