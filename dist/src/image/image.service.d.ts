import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { ConfigService } from '@nestjs/config';
export declare class ImageService {
    private readonly imageRepository;
    private readonly configService;
    uploadImageToCloudinary(file: Express.Multer.File): PromiseLike<null> | null;
    deleteImageFromCloudinary(image: string): void;
    constructor(imageRepository: Repository<Image>, configService: ConfigService);
    uploadImage(file: Express.Multer.File): Promise<Image>;
    getImageById(id: string): Promise<{
        success: boolean;
        image?: Image;
        message?: string;
    }>;
    getAllImages(): Promise<Image[]>;
    deleteImage(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
