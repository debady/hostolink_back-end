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
exports.DocumentsIdentiteEntity = void 0;
const user_entity_1 = require("../../utilisateur/entities/user.entity");
const typeorm_1 = require("typeorm");
let DocumentsIdentiteEntity = class DocumentsIdentiteEntity {
};
exports.DocumentsIdentiteEntity = DocumentsIdentiteEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_document' }),
    __metadata("design:type", Number)
], DocumentsIdentiteEntity.prototype, "id_document", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_user', type: 'uuid' }),
    __metadata("design:type", String)
], DocumentsIdentiteEntity.prototype, "id_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'type_document', length: 50 }),
    __metadata("design:type", String)
], DocumentsIdentiteEntity.prototype, "type_document", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'url_recto', type: 'text' }),
    __metadata("design:type", String)
], DocumentsIdentiteEntity.prototype, "url_recto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'url_verso', type: 'text', nullable: true }),
    __metadata("design:type", String)
], DocumentsIdentiteEntity.prototype, "url_verso", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'url_photo_profile', type: 'text' }),
    __metadata("design:type", String)
], DocumentsIdentiteEntity.prototype, "url_photo_profile", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'statut_validation', length: 20, default: 'en_attente' }),
    __metadata("design:type", String)
], DocumentsIdentiteEntity.prototype, "statut_validation", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'date_envoi' }),
    __metadata("design:type", Date)
], DocumentsIdentiteEntity.prototype, "date_envoi", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.document_identite, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_user' }),
    __metadata("design:type", user_entity_1.User)
], DocumentsIdentiteEntity.prototype, "user", void 0);
exports.DocumentsIdentiteEntity = DocumentsIdentiteEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'documents_identite' })
], DocumentsIdentiteEntity);
//# sourceMappingURL=documents_identite.entity.js.map