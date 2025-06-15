"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsIdentiteModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const documents_identite_entity_1 = require("./entities/documents_identite.entity");
const documents_identite_service_1 = require("./documents_identite.service");
const documents_identite_controller_1 = require("./documents_identite.controller");
const cloudinary_config_1 = require("../../config/cloudinary.config");
let DocumentsIdentiteModule = class DocumentsIdentiteModule {
};
exports.DocumentsIdentiteModule = DocumentsIdentiteModule;
exports.DocumentsIdentiteModule = DocumentsIdentiteModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([documents_identite_entity_1.DocumentsIdentiteEntity])],
        providers: [documents_identite_service_1.DocumentsIdentiteService, cloudinary_config_1.CloudinaryService],
        controllers: [documents_identite_controller_1.DocumentsIdentiteController],
        exports: [documents_identite_service_1.DocumentsIdentiteService],
    })
], DocumentsIdentiteModule);
//# sourceMappingURL=documents_identite.module.js.map