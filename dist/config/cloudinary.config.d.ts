import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
export declare const configureCloudinary: (configService: ConfigService) => typeof cloudinary;
export declare class CloudinaryService {
    private configService;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File): Promise<string>;
}
