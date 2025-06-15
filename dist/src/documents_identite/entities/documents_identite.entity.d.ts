import { User } from 'src/utilisateur/entities/user.entity';
export declare class DocumentsIdentiteEntity {
    id_document: number;
    id_user: string;
    type_document: string;
    url_recto: string;
    url_verso?: string;
    url_photo_profile: string;
    statut_validation: string;
    date_envoi: Date;
    user: User;
}
