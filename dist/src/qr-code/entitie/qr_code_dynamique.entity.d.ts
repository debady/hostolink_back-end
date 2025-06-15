import { User } from 'src/utilisateur/entities/user.entity';
export declare class QrCodeDynamique {
    id_qrcode: number;
    short_id: string;
    id_user_etablissement_sante: number;
    id_user: string;
    token: string;
    date_creation: Date;
    date_expiration: Date;
    statut: string;
    user: User;
}
