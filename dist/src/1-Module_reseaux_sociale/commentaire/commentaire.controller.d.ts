import { CommentaireService } from './commentaire.service';
import { Commentaire } from './entities/commentaire.entity';
export declare class CommentaireController {
    private readonly commentaireService;
    constructor(commentaireService: CommentaireService);
    create(id_publication: number, body: any): Promise<Commentaire>;
    findByPublicationId(id_publication: number): Promise<Commentaire[]>;
    findByUserAndPublication(id_publication: number, id_user: string): Promise<Commentaire[]>;
    findByEtablissementAndPublication(id_publication: number, id_etablissement: number): Promise<Commentaire[]>;
    findByAdminAndPublication(id_publication: number, id_admin: number): Promise<Commentaire[]>;
    findByExpertAndPublication(id_publication: number, id_expert: number): Promise<Commentaire[]>;
    getCommentsCount(id_publication: number): Promise<{
        commentaires_count: number;
    }>;
}
