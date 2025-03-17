import { CommentaireService } from './commentaire.service';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { Commentaire } from './entities/commentaire.entity';
export declare class CommentaireController {
    private readonly commentaireService;
    constructor(commentaireService: CommentaireService);
    create(id_publication: number, createCommentaireDto: CreateCommentaireDto): Promise<Commentaire>;
    findByPublicationIdAndUserId(id_publication: number, id_user: number): Promise<Commentaire[]>;
    findByPublicationId(id_publication: number): Promise<Commentaire[]>;
    deleteComment(id_commentaire: number, body: {
        id_user: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
