import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { Publication } from './entities/publication.entity';
import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { CreateCommentaireDto } from 'src/commentaire/dto/create-commentaire.dto';
export declare class PublicationController {
    private readonly publicationService;
    constructor(publicationService: PublicationService);
    create(createPublicationDto: CreatePublicationDto): Promise<Publication>;
    findAll(): Promise<Publication[]>;
    findOne(id: number): Promise<Publication>;
    findByUserId(userId: number): Promise<Publication[]>;
    addComment(id_publication: number, createCommentaireDto: CreateCommentaireDto): Promise<Commentaire>;
    getCommentsByPublicationId(id_publication: number): Promise<Commentaire[]>;
    likePost(id: number): Promise<Publication>;
    dislikePost(id: number): Promise<Publication>;
}
