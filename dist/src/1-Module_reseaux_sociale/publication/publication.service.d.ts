import { Repository } from 'typeorm';
import { Publication } from './entities/publication.entity';
import { SocialCloudinaryServicess } from 'src/social_cloudinary/social_cloudinary.service';
export declare class PublicationService {
    private readonly publicationRepository;
    private readonly SocialCloudinaryService;
    private readonly logger;
    constructor(publicationRepository: Repository<Publication>, SocialCloudinaryService: SocialCloudinaryServicess);
    create(data: any, imageFile?: Express.Multer.File): Promise<Publication>;
    private validateSingleAuthor;
    findAll(): Promise<Publication[]>;
    findOne(id: number): Promise<Publication>;
    findByUser(id_user: string): Promise<Publication[]>;
    findByEtablissement(id_user_etablissement_sante: number): Promise<Publication[]>;
    findByAdmin(id_admin_gestionnaire: number): Promise<Publication[]>;
    findByExpert(id_expert: number): Promise<Publication[]>;
    likePost(id: number): Promise<Publication>;
    dislikePost(id: number): Promise<Publication>;
    getLikesCount(id: number): Promise<{
        compteur_like: number;
    }>;
}
