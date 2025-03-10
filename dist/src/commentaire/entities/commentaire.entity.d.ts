import { Publication } from 'src/publication/entities/publication.entity';
import { User } from 'src/user/entities/user.entity';
export declare class Commentaire {
    id_commentaire: number;
    contenu: string;
    date_commentaire: Date;
    publication: Publication;
    user: User;
}
