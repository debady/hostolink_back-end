import { User } from 'src/utilisateur/entities/user.entity';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
export declare enum ImageMotifEnum {
    PROFILE = "photo_profile",
    DOCUMENT_IDENTITE_RECTO = "document_identiter_recto",
    DOCUMENT_IDENTITE_VERSO = "document_identiter_verso",
    RESEAU_SOCIAL = "reseau_social",
    DISCUSSION_ASSISTANCE = "discussion_assistance",
    PUBLICITE = "publicite",
    ADMINISTRATEUR = "Administrateur",
    AVATAR_ADMIN = "avatar_admin",
    AUTRE = "autre"
}
export declare class Image {
    id_image: string;
    url_image: string;
    date: Date;
    id_user: string | null;
    user: User;
    id_user_etablissement_sante?: number;
    motif: ImageMotifEnum;
    type_user?: string;
    id_admin_gestionnaire?: number;
    administrateur?: Administrateur;
}
