"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const publication_controller_1 = require("./publication.controller");
const publication_service_1 = require("./publication.service");
const publication_entity_1 = require("./entities/publication.entity");
const commentaire_entity_1 = require("../commentaire/entities/commentaire.entity");
const partage_entity_1 = require("../partage/entities/partage.entity");
const social_cloudinary_module_1 = require("../../social_cloudinary/social_cloudinary.module");
let PublicationModule = class PublicationModule {
};
exports.PublicationModule = PublicationModule;
exports.PublicationModule = PublicationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                publication_entity_1.Publication,
                commentaire_entity_1.Commentaire,
                partage_entity_1.Partage
            ]),
            social_cloudinary_module_1.SocialCloudinaryModule
        ],
        controllers: [publication_controller_1.PublicationController],
        providers: [publication_service_1.PublicationService],
        exports: [publication_service_1.PublicationService]
    })
], PublicationModule);
//# sourceMappingURL=publication.module.js.map