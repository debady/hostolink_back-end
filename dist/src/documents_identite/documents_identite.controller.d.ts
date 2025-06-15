import { DocumentsIdentiteService } from './documents_identite.service';
import { CreateDocumentsIdentiteDto } from './dto/create-documents-identite.dto';
export declare class DocumentsIdentiteController {
    private readonly documentsIdentiteService;
    constructor(documentsIdentiteService: DocumentsIdentiteService);
    createDocument(req: any, files: {
        recto?: Express.Multer.File[];
        verso?: Express.Multer.File[];
        photo_profile?: Express.Multer.File[];
    }, createDto: CreateDocumentsIdentiteDto): Promise<import("./entities/documents_identite.entity").DocumentsIdentiteEntity>;
}
