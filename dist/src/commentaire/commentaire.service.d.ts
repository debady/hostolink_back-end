import { Repository } from 'typeorm';
import { Commentaire } from './entities/commentaire.entity';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
export declare class CommentaireService {
    private readonly commentaireRepository;
    constructor(commentaireRepository: Repository<Commentaire>);
    create(createCommentaireDto: CreateCommentaireDto): Promise<Commentaire>;
    findByPublicationId(id_publication: number): Promise<Commentaire[]>;
    findByPublicationIdAndUserId(id_publication: number, id_user: number): Promise<Commentaire[]>;
}
