import { Repository } from 'typeorm';
import { Commentaire } from './entities/commentaire.entity';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
export declare class CommentaireService {
    private readonly commentaireRepository;
    private readonly logger;
    constructor(commentaireRepository: Repository<Commentaire>);
    create(id_publication: number, createCommentaireDto: CreateCommentaireDto): Promise<Commentaire>;
    private validateSingleAuthor;
    findByPublicationId(id_publication: number): Promise<Commentaire[]>;
    findByUserAndPublication(id_publication: number, id_user: string): Promise<Commentaire[]>;
    findByEtablissementAndPublication(id_publication: number, id_etablissement: number): Promise<Commentaire[]>;
    findByAdminAndPublication(id_publication: number, id_admin: number): Promise<Commentaire[]>;
    findByExpertAndPublication(id_publication: number, id_expert: number): Promise<Commentaire[]>;
    getCommentsCount(id_publication: number): Promise<{
        commentaires_count: number;
    }>;
}
