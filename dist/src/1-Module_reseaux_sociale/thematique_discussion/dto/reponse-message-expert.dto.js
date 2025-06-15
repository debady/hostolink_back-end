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
exports.RepondreMessageExpertDto = void 0;
const class_validator_1 = require("class-validator");
class RepondreMessageExpertDto {
}
exports.RepondreMessageExpertDto = RepondreMessageExpertDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], RepondreMessageExpertDto.prototype, "id_thematique_discussion", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], RepondreMessageExpertDto.prototype, "id_expert", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RepondreMessageExpertDto.prototype, "contenu", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['texte', 'image']),
    __metadata("design:type", String)
], RepondreMessageExpertDto.prototype, "type_message", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RepondreMessageExpertDto.prototype, "url_image", void 0);
//# sourceMappingURL=reponse-message-expert.dto.js.map