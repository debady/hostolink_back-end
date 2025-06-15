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
exports.AppelVideo = void 0;
const expert_sante_entity_1 = require("../../user_etablissement_sante/entities/expert_sante.entity");
const user_entity_1 = require("../../utilisateur/entities/user.entity");
const typeorm_1 = require("typeorm");
let AppelVideo = class AppelVideo {
};
exports.AppelVideo = AppelVideo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AppelVideo.prototype, "id_appel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_user' }),
    __metadata("design:type", user_entity_1.User)
], AppelVideo.prototype, "utilisateur", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expert_sante_entity_1.ExpertSante, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'id_expert' }),
    __metadata("design:type", expert_sante_entity_1.ExpertSante)
], AppelVideo.prototype, "expert", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AppelVideo.prototype, "canal_agora", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AppelVideo.prototype, "token_agora", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'en_attente' }),
    __metadata("design:type", String)
], AppelVideo.prototype, "status_appel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AppelVideo.prototype, "date_debut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], AppelVideo.prototype, "date_fin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: true }),
    __metadata("design:type", Number)
], AppelVideo.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision', nullable: true }),
    __metadata("design:type", Number)
], AppelVideo.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], AppelVideo.prototype, "compte_rendu", void 0);
exports.AppelVideo = AppelVideo = __decorate([
    (0, typeorm_1.Entity)('appel_video')
], AppelVideo);
//# sourceMappingURL=appel_video.entity.js.map