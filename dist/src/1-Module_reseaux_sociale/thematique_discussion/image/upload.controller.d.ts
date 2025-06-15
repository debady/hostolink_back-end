import { CloudinaryService } from './claudinary.service';
export declare class UploadController {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    uploadImage(file: Express.Multer.File): Promise<{
        url: any;
        public_id: any;
    }>;
}
