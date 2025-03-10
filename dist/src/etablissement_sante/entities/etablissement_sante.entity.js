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
exports.EtablissementSante = void 0;
const typeorm_1 = require("typeorm");
let EtablissementSante = class EtablissementSante {
};
exports.EtablissementSante = EtablissementSante;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_etablissement' }),
    __metadata("design:type", Number)
], EtablissementSante.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], EtablissementSante.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], EtablissementSante.prototype, "telephone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], EtablissementSante.prototype, "categorie", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], EtablissementSante.prototype, "adresse", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'creat_at' }),
    __metadata("design:type", Date)
], EtablissementSante.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    __metadata("design:type", Number)
], EtablissementSante.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'double precision' }),
    __metadata("design:type", Number)
], EtablissementSante.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326 }),
    __metadata("design:type", Object)
], EtablissementSante.prototype, "geom", void 0);
exports.EtablissementSante = EtablissementSante = __decorate([
    (0, typeorm_1.Entity)('etablissement_sante')
], EtablissementSante);
//# sourceMappingURL=etablissement_sante.entity.js.map