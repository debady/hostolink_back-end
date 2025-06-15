import { CloudinaryService } from './cloudinary.service';
export declare class UploadController {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    uploadLogo(file: Express.Multer.File): Promise<{
        message: string;
        imageUrl: string;
    }>;
}
