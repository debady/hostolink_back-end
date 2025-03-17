import { Repository } from 'typeorm';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { Publication } from './entities/publication.entity';
import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { CreateCommentaireDto } from 'src/commentaire/dto/create-commentaire.dto';
export declare class PublicationService {
    private readonly publicationRepository;
    private readonly commentaireRepository;
    private readonly cloudinaryService;
    constructor(publicationRepository: Repository<Publication>, commentaireRepository: Repository<Commentaire>, cloudinaryService: any);
    uploadImageToCloudinary(file: Express.Multer.File): Promise<string | undefined>;
    create(createPublicationDto: CreatePublicationDto, file?: Express.Multer.File): Promise<Publication>;
    findOne(id_publication: number): Promise<Publication>;
    likePost(id_publication: number): Promise<Publication>;
    dislikePost(id_publication: number): Promise<Publication>;
    findAll(): Promise<Publication[]>;
    findByUserId(userId: number): Promise<Publication[]>;
    addComment(createCommentaireDto: CreateCommentaireDto): Promise<Commentaire>;
    getCommentsByPublicationId(id_publication: number): Promise<Commentaire[]>;
    deletePublication(id_publication: number, id_user: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
