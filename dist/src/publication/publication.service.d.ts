import { Repository } from 'typeorm';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { Publication } from './entities/publication.entity';
import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { CreateCommentaireDto } from 'src/commentaire/dto/create-commentaire.dto';
export declare class PublicationService {
    private readonly publicationRepository;
    private readonly commentaireRepository;
    partageService: any;
    constructor(publicationRepository: Repository<Publication>, commentaireRepository: Repository<Commentaire>);
    create(createPublicationDto: CreatePublicationDto): Promise<Publication>;
    findOne(id_publication: number): Promise<Publication>;
    likePost(id_publication: number): Promise<Publication>;
    dislikePost(id_publication: number): Promise<Publication>;
    findAll(): Promise<Publication[]>;
    findByUserId(userId: number): Promise<Publication[]>;
    addComment(createCommentaireDto: CreateCommentaireDto): Promise<Commentaire>;
    getCommentsByPublicationId(id_publication: number): Promise<Commentaire[]>;
}
