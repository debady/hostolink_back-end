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
exports.RegisterUserDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterUserDto {
}
exports.RegisterUserDto = RegisterUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'identifiant ne peut pas être vide' }),
    (0, class_validator_1.IsString)({ message: 'L\'identifiant doit être une chaîne de caractères' }),
    (0, class_validator_1.Matches)(/^(\+?[1-9][0-9]{7,14}|[\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/, { message: 'L\'identifiant doit être un email valide ou un numéro de téléphone (8 à 15 chiffres)' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "identifier", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Le mot de passe ne peut pas être vide' }),
    (0, class_validator_1.IsString)({ message: 'Le mot de passe doit être une chaîne de caractères' }),
    (0, class_validator_1.MinLength)(4, { message: 'Le mot de passe doit contenir au moins 4 caractères' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "password", void 0);
//# sourceMappingURL=register-user.dto.js.map