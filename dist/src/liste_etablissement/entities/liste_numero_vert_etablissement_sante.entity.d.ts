import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
export declare class ListeNumeroEtablissementSante {
    id_liste_num_etablissement_sante: number;
    administrateur: Administrateur;
    nom_etablissement: string;
    contact: string;
    image: string;
    presentation: string;
    adresse: string;
    latitude: number;
    longitude: number;
    type_etablissement: string;
    site_web?: string;
    categorie: string;
}
