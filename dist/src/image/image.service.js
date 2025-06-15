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
const image_entity_2 = require("./entities/image.entity");
let ImageService = class ImageService {
    constructor(imageRepository, configService) {
        this.imageRepository = imageRepository;
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }
    async uploadImage(file, id_user, motif, type_user) {
        if (!file || !file.buffer) {
            throw new common_1.InternalServerErrorException('Le fichier est invalide ou non reçu');
        }
        try {
            if (motif === image_entity_2.ImageMotifEnum.PROFILE) {
                const existingImage = await this.imageRepository.findOne({ where: { id_user, motif } });
                if (existingImage) {
                    const urlParts = existingImage.url_image.split('/');
                    const publicIdWithExtension = urlParts[urlParts.length - 1];
                    const publicId = publicIdWithExtension.split('.')[0];
                    await cloudinary_1.v2.uploader.destroy(publicId);
                    await this.imageRepository.delete(existingImage.id_image);
                }
            }
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary_1.v2.uploader.upload_stream({
                    folder: 'dossier_hostolink_preset',
                    transformation: [{ quality: "auto", fetch_format: "auto" }]
                }, (error, result) => (error ? reject(error) : resolve(result)));
                stream.end(file.buffer);
            });
            if (!result || !result.secure_url) {
                throw new common_1.InternalServerErrorException('Erreur lors du téléversement sur Cloudinary');
            }
            const newImage = this.imageRepository.create({
                url_image: result.secure_url,
                id_user,
                motif: motif || image_entity_2.ImageMotifEnum.PROFILE,
                type_user,
            });
            return await this.imageRepository.save(newImage);
        }
        catch (error) {
            console.error('❌ Erreur Cloudinary:', error);
            throw new common_1.InternalServerErrorException('Échec du téléchargement sur Cloudinary');
        }
    }
    async getImageById(id) {
        const image = await this.imageRepository.findOne({ where: { id_image: id } });
        if (!image) {
            return { success: false, message: 'Image non trouvée' };
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
        try {
            const urlParts = image.url_image.split('/');
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = publicIdWithExtension.split('.')[0];
            await cloudinary_1.v2.uploader.destroy(publicId);
            await this.imageRepository.delete(id);
            return { success: true, message: 'Image supprimée avec succès' };
        }
        catch (error) {
            console.error('❌ Erreur lors de la suppression de l’image:', error);
            throw new common_1.InternalServerErrorException('Impossible de supprimer l’image');
        }
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