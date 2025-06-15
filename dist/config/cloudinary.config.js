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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = exports.configureCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const configureCloudinary = (configService) => {
    cloudinary_1.v2.config({
        cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
        api_key: configService.get('CLOUDINARY_API_KEY'),
        api_secret: configService.get('CLOUDINARY_API_SECRET'),
    });
    return cloudinary_1.v2;
};
exports.configureCloudinary = configureCloudinary;
let CloudinaryService = class CloudinaryService {
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }
    async uploadImage(file) {
        if (!file || !file.buffer) {
            throw new Error('image non télécharger ou invalide');
        }
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload_stream({ folder: 'numéros_verts' }, (error, result) => {
                if (error) {
                    console.error('Cloudinary Upload Error:', error);
                    return reject(new Error('Erreur lors de l’upload sur Cloudinary'));
                }
                if (!result || !result.secure_url) {
                    console.error('Cloudinary Response Undefined:', result);
                    return reject(new Error("Cloudinary n'a pas retourné d'URL"));
                }
                resolve(result.secure_url);
            }).end(file.buffer);
        });
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.config.js.map