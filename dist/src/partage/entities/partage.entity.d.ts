import { User } from 'src/user/entities/user.entity';
import { Publication } from 'src/publication/entities/publication.entity';
export declare class Partage {
    id_partage: number;
    user: User;
    publication: Publication;
    lien_partage: string;
    date_partage: Date;
    plateforme_partage: string;
    nombre_clics: number;
}
