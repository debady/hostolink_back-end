"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const image_entity_1 = require("./entities/image.entity");
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
let ImageService = class ImageService {
    uploadImageToCloudinary(file) {
        throw new Error('Method not implemented.');
    }
    deleteImageFromCloudinary(image) {
        throw new Error('Method not implemented.');
    }
    constructor(imageRepository, configService) {
        this.imageRepository = imageRepository;
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }
    async uploadImage(file) {
        if (!file || !file.buffer) {
            throw new Error('Le fichier est invalide ou non reçu');
        }
        try {
            console.log('Cloudinary API Key:', this.configService.get('CLOUDINARY_API_KEY'));
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'dossier_hostolink_preset' }, (error, result) => {
                    if (error) {
                        console.error('Erreur Cloudinary:', error);
                        reject(new Error('Échec du téléchargement sur Cloudinary'));
                    }
                    else if (!result) {
                        reject(new Error('Cloudinary n\'a retourné aucun résultat'));
                    }
                    else {
                        resolve(result);
                    }
                });
                stream.end(file.buffer);
            });
            if (!result || !result.secure_url) {
                throw new Error('Erreur lors du téléversement sur Cloudinary');
            }
            const newImage = this.imageRepository.create({
                url_image: result.secure_url,
            });
            return await this.imageRepository.save(newImage);
        }
        catch (error) {
            console.error('Erreur Cloudinary:', error);
            throw new Error('Échec du téléchargement sur Cloudinary');
        }
    }
    async getImageById(id) {
        const image = await this.imageRepository.findOne({ where: { id_image: id } });
        if (!image) {
            return { success: false, message: "Image non trouvée" };
        }
        return { success: true, image };
    }
    async getAllImages() {
        return await this.imageRepository.find();
    }
    async deleteImage(id) {
        const image = await this.imageRepository.findOneBy({ id_image: id });
        if (!image) {
            throw new common_1.NotFoundException('Image non trouvée');
        }
        const publicId = image.url_image.split('/').pop()?.split('.')[0];
        await cloudinary_1.v2.uploader.destroy(`dossier_hostolink_preset/${publicId}`);
        await this.imageRepository.delete(id);
        return { success: true, message: 'Image supprimée avec succès' };
    }
};
exports.ImageService = ImageService;
exports.ImageService = ImageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(image_entity_1.Image)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], ImageService);
//# sourceMappingURL=image.service.js.map