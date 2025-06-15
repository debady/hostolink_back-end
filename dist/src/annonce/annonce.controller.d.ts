import { AnnonceService } from './annonce.service';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { UpdateAnnonceDto } from './dto/update-annoce.dto';
import { CloudinaryService } from './image/cloudinary.service';
export declare class AnnonceController {
    private readonly annonceService;
    private readonly cloudinaryService;
    constructor(annonceService: AnnonceService, cloudinaryService: CloudinaryService);
    createAnnonce(dto: CreateAnnonceDto): Promise<import("./entities/annonce.entity").Annonce>;
    uploadImage(file: Express.Multer.File): Promise<{
        secureUrl: string;
    }>;
    getAllAnnonces(): Promise<import("./entities/annonce.entity").Annonce[]>;
    updateAnnonce(id: number, dto: UpdateAnnonceDto): Promise<import("./entities/annonce.entity").Annonce>;
    deleteAnnonce(id: number): Promise<{
        message: string;
    }>;
}
