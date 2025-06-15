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
exports.VerifyOtpDto = exports.GenerateOtpDto = void 0;
const class_validator_1 = require("class-validator");
const otp_entity_1 = require("../entities/otp.entity");
class GenerateOtpDto {
}
exports.GenerateOtpDto = GenerateOtpDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^(\+?[1-9][0-9]{7,14}|[\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/, {
        message: "L'identifiant doit être un email valide ou un numéro de téléphone (8 à 15 chiffres).",
    }),
    __metadata("design:type", String)
], GenerateOtpDto.prototype, "identifier", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(otp_entity_1.MoyenEnvoiEnum, { message: "Le moyen d'envoi doit être EMAIL ou TELEPHONE." }),
    __metadata("design:type", String)
], GenerateOtpDto.prototype, "moyen_envoyer", void 0);
class VerifyOtpDto {
}
exports.VerifyOtpDto = VerifyOtpDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^(\+?[1-9][0-9]{7,14}|[\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/, {
        message: "L'identifiant doit être un email valide ou un numéro de téléphone (8 à 15 chiffres).",
    }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "identifier", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\d{4}$/, { message: "Le code OTP doit être un nombre de 4 chiffres." }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "otpCode", void 0);
__decorate([
    (0, class_validator_1.IsUUID)("4", { message: "L'ID utilisateur doit être un UUID valide." }),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "id_user", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], VerifyOtpDto.prototype, "id_user_etablissement_sante", void 0);
//# sourceMappingURL=otp.dto.js.map