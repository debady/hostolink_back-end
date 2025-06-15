import { Commentaire } from 'src/1-Module_reseaux_sociale/commentaire/entities/commentaire.entity';
import { Partage } from 'src/1-Module_reseaux_sociale/partage/entities/partage.entity';
export declare class Publication {
    id_publication: number;
    titre_publication: string;
    contenu: string;
    image: string;
    date_publication: Date;
    compteur_like: number;
    id_user: string;
    id_user_etablissement_sante: number;
    id_admin_gestionnaire: number;
    id_expert: number;
    commentaires: Commentaire[];
    partages: Partage[];
}
