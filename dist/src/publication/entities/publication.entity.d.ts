import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { Partage } from 'src/partage/entities/partage.entity';
import { User } from 'src/user/entities/user.entity';
export declare class Publication {
    id_publication: number;
    titre_publication: string;
    contenu: string;
    image?: string;
    date_publication: Date;
    compteur_like: number;
    user: User;
    commentaires: Commentaire[];
    Partages: Partage[];
}
