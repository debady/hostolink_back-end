import { Otp } from 'src/otp/entities/otp.entity';
export declare class User {
    [x: string]: any;
    id_user: number;
    email?: string;
    telephone?: string;
    mdp?: string;
    nom?: string;
    prenom?: string;
    pays?: string;
    photo_profile?: string;
    date_inscription: Date;
    code_confirmation: string | null;
    otps?: Otp[];
    position?: string;
}
