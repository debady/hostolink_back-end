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
exports.Thematique = void 0;
const typeorm_1 = require("typeorm");
const message_thematique_entity_1 = require("./message_thematique.entity");
const administrateur_entity_1 = require("../../../administrateur/entities/administrateur.entity");
let Thematique = class Thematique {
};
exports.Thematique = Thematique;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Thematique.prototype, "id_thematique_discussion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => administrateur_entity_1.Administrateur, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_admin_gestionnaire' }),
    __metadata("design:type", administrateur_entity_1.Administrateur)
], Thematique.prototype, "administrateur", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Thematique.prototype, "titre_thematique", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Thematique.prototype, "sous_titre", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Thematique.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Thematique.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Thematique.prototype, "nbre_expert", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Thematique.prototype, "date_ajout", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_thematique_entity_1.MessageThematique, (message) => message.thematique),
    __metadata("design:type", Array)
], Thematique.prototype, "messages", void 0);
exports.Thematique = Thematique = __decorate([
    (0, typeorm_1.Entity)('thematiques')
], Thematique);
//# sourceMappingURL=thematique.entity.js.map