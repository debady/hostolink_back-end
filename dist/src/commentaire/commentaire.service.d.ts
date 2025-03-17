import { Repository } from 'typeorm';
import { Commentaire } from './entities/commentaire.entity';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { Publication } from 'src/publication/entities/publication.entity';
import { User } from 'src/user/entities/user.entity';
export declare class CommentaireService {
    private readonly commentaireRepository;
    private readonly publicationRepository;
    private readonly userRepository;
    constructor(commentaireRepository: Repository<Commentaire>, publicationRepository: Repository<Publication>, userRepository: Repository<User>);
    create(id_publication: number, createCommentaireDto: CreateCommentaireDto): Promise<Commentaire>;
    findByPublicationId(id_publication: number): Promise<Commentaire[]>;
    findByPublicationIdAndUserId(id_publication: number, id_user: number): Promise<Commentaire[]>;
    deleteComment(id_commentaire: number, id_user: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
