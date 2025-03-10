import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { ConfigService } from '@nestjs/config';
export declare class ImageService {
    private readonly imageRepository;
    private readonly configService;
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
