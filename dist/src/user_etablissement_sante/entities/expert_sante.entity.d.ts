import { UserEtablissementSante } from './user-etablissement-sante.entity';
export declare class ExpertSante {
    id_expert: number;
    user_etablissement_sante: UserEtablissementSante;
    nom: string;
    prenom: string;
    domaine_expertise: string;
    identifiant: string;
    mot_de_passe: string;
    url_profile: string;
}
