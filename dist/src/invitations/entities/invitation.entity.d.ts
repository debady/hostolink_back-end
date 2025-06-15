import { User } from 'src/utilisateur/entities/user.entity';
export declare class Invitation {
    id_invitation: number;
    id_user: string;
    code_invitation: string;
    nombre_partages: number;
    nombre_clicks: number;
    nombre_inscriptions: number;
    date_creation: Date;
    user: User;
}
