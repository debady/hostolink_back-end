"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialCloudinaryServicess = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const buffer_to_stream_1 = __importDefault(require("buffer-to-stream"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
let SocialCloudinaryServicess = class SocialCloudinaryServicess {
    async uploadImage(file) {
        return new Promise((resolve, reject) => {
            if (!file)
                return reject(new Error('Aucun fichier reçu.'));
            const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'reseau-social/images-des-publications' }, (error, result) => {
                if (error) {
                    console.error('❌ Erreur Cloudinary:', error);
                    return reject(error);
                }
                resolve(result.secure_url);
            });
            (0, buffer_to_stream_1.default)(file.buffer).pipe(stream);
        });
    }
};
exports.SocialCloudinaryServicess = SocialCloudinaryServicess;
exports.SocialCloudinaryServicess = SocialCloudinaryServicess = __decorate([
    (0, common_1.Injectable)()
], SocialCloudinaryServicess);
//# sourceMappingURL=social_cloudinary.service.js.map