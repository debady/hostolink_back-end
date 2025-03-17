import { PublicationService } from './publication.service';
import { Publication } from './entities/publication.entity';
import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
export declare class PublicationController {
    private readonly publicationService;
    constructor(publicationService: PublicationService);
    create(body: any, file: Express.Multer.File): Promise<Publication>;
    findAll(): Promise<Publication[]>;
    findOne(id: number): Promise<Publication>;
    findByUserId(userId: number): Promise<Publication[]>;
    addComment(id_publication: number, body: any): Promise<Commentaire>;
    getCommentsByPublicationId(id_publication: number): Promise<Commentaire[]>;
    likePost(id: number): Promise<Publication>;
    dislikePost(id: number): Promise<Publication>;
    deletePublication(id: number, body: {
        id_user: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
