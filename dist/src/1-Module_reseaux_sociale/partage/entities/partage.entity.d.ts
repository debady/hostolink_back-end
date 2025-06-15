import { Publication } from 'src/1-Module_reseaux_sociale/publication/entities/publication.entity';
export declare class Partage {
    id_partage: number;
    publication: Publication;
    lien_partage: string;
    date_partage: Date;
    plateforme_partage: string;
    nombre_clics: number;
    id_user: string;
    id_user_etablissement_sante: number;
    id_admin_gestionnaire: number;
    id_expert: number;
}
