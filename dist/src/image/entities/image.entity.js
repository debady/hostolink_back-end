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
exports.Image = exports.ImageMotifEnum = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../utilisateur/entities/user.entity");
const administrateur_entity_1 = require("../../administrateur/entities/administrateur.entity");
var ImageMotifEnum;
(function (ImageMotifEnum) {
    ImageMotifEnum["PROFILE"] = "photo_profile";
    ImageMotifEnum["DOCUMENT_IDENTITE_RECTO"] = "document_identiter_recto";
    ImageMotifEnum["DOCUMENT_IDENTITE_VERSO"] = "document_identiter_verso";
    ImageMotifEnum["RESEAU_SOCIAL"] = "reseau_social";
    ImageMotifEnum["DISCUSSION_ASSISTANCE"] = "discussion_assistance";
    ImageMotifEnum["PUBLICITE"] = "publicite";
    ImageMotifEnum["ADMINISTRATEUR"] = "Administrateur";
    ImageMotifEnum["AVATAR_ADMIN"] = "avatar_admin";
    ImageMotifEnum["AUTRE"] = "autre";
})(ImageMotifEnum || (exports.ImageMotifEnum = ImageMotifEnum = {}));
let Image = class Image {
};
exports.Image = Image;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Image.prototype, "id_image", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Image.prototype, "url_image", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Image.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Image.prototype, "id_user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_user' }),
    __metadata("design:type", user_entity_1.User)
], Image.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Image.prototype, "id_user_etablissement_sante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ImageMotifEnum, nullable: false }),
    __metadata("design:type", String)
], Image.prototype, "motif", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Image.prototype, "type_user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Image.prototype, "id_admin_gestionnaire", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => administrateur_entity_1.Administrateur, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_admin_gestionnaire' }),
    __metadata("design:type", administrateur_entity_1.Administrateur)
], Image.prototype, "administrateur", void 0);
exports.Image = Image = __decorate([
    (0, typeorm_1.Entity)('images')
], Image);
//# sourceMappingURL=image.entity.js.map