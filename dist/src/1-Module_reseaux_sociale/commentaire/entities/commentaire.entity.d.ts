import { Publication } from 'src/1-Module_reseaux_sociale/publication/entities/publication.entity';
export declare class Commentaire {
    id_commentaire: number;
    contenu: string;
    date_commentaire: Date;
    publication: Publication;
    id_user: string;
    id_user_etablissement_sante: number;
    id_admin_gestionnaire: number;
    id_expert: number;
}
