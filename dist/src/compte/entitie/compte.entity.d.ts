import { User } from 'src/utilisateur/entities/user.entity';
export declare enum TypeUserEnum {
    UTILISATEUR = "utilisateur",
    ETABLISSEMENT = "etablissement"
}
export declare class Compte {
    id_compte: number;
    solde_compte: number;
    solde_bonus: number;
    cumule_mensuel: number;
    plafond: number;
    mode_paiement_preferentiel: string;
    type_user: TypeUserEnum;
    devise: string;
    numero_compte: string;
    date_creation_compte: Date;
    date_modification: Date;
    statut: string;
    id_user: string;
    id_user_etablissement_sante: number;
    user: User;
}
