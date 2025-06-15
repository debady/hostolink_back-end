import { Repository } from 'typeorm';
import { DocumentsIdentiteEntity } from './entities/documents_identite.entity';
import { CloudinaryService } from '../../config/cloudinary.config';
import { CreateDocumentsIdentiteDto } from './dto/create-documents-identite.dto';
export declare class DocumentsIdentiteService {
    private documentsIdentiteRepository;
    private cloudinaryService;
    constructor(documentsIdentiteRepository: Repository<DocumentsIdentiteEntity>, cloudinaryService: CloudinaryService);
    createDocument(id_user: string, createDto: CreateDocumentsIdentiteDto, files: {
        recto?: Express.Multer.File;
        verso?: Express.Multer.File;
        photo_profile: Express.Multer.File;
    }): Promise<DocumentsIdentiteEntity>;
}
