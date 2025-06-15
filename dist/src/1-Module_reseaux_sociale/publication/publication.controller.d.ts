import { PublicationService } from './publication.service';
import { Publication } from './entities/publication.entity';
export declare class PublicationController {
    private readonly publicationService;
    private readonly logger;
    constructor(publicationService: PublicationService);
    createPublication(image: Express.Multer.File, body: any): Promise<Publication>;
    findAll(): Promise<Publication[]>;
    findOne(id: number): Promise<Publication>;
    findByUser(id_user: string): Promise<Publication[]>;
    findByEtablissement(id_etablissement: number): Promise<Publication[]>;
    findByAdmin(id_admin: number): Promise<Publication[]>;
    findByExpert(id_expert: number): Promise<Publication[]>;
    likePost(id: number): Promise<Publication>;
    dislikePost(id: number): Promise<Publication>;
    getLikesCount(id: number): Promise<{
        compteur_like: number;
    }>;
}
