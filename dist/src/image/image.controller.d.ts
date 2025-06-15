import { ImageService } from './image.service';
import { ImageMotifEnum } from './entities/image.entity';
export declare class ImageController {
    private readonly imageService;
    constructor(imageService: ImageService);
    uploadImage(file: Express.Multer.File, req: any, motif: ImageMotifEnum, type_user?: string): Promise<{
        success: boolean;
        message: string;
        image?: undefined;
    } | {
        success: boolean;
        image: import("./entities/image.entity").Image;
        message?: undefined;
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
