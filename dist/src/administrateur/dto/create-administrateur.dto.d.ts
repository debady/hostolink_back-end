export declare class CreateAdministrateurDto {
    email: string;
    telephone: string;
    mot_de_passe: string;
    role: string;
    nom?: string;
    prenom?: string;
    adresse?: string;
    solde_de_rechargement?: number;
    cumule_des_transactions?: number;
    permissions?: Record<string, any>;
}
