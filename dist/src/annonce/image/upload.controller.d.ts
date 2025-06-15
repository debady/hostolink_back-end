import { CloudinaryService } from './cloudinary.service';
export declare class UploadController {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    uploadImageAnnonce(file: Express.Multer.File): Promise<{
        imageUrl: string;
    }>;
}
