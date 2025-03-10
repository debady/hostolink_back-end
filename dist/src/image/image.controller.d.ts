import { ImageService } from './image.service';
export declare class ImageController {
    private readonly imageService;
    constructor(imageService: ImageService);
    uploadImage(file: Express.Multer.File): Promise<{
        success: boolean;
        image: import("./entities/image.entity").Image;
    }>;
    getImage(id: string): Promise<{
        success: boolean;
        image?: import("./entities/image.entity").Image;
        message?: string;
    }>;
    getAllImages(): Promise<import("./entities/image.entity").Image[]>;
    deleteImage(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
