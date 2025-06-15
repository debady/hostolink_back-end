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
exports.TransactionFrais = exports.ModePayment = exports.TransactionFraisType = void 0;
const typeorm_1 = require("typeorm");
var TransactionFraisType;
(function (TransactionFraisType) {
    TransactionFraisType["INTERNE"] = "interne";
    TransactionFraisType["EXTERNE"] = "externe";
    TransactionFraisType["BANCAIRE"] = "bancaire";
})(TransactionFraisType || (exports.TransactionFraisType = TransactionFraisType = {}));
var ModePayment;
(function (ModePayment) {
    ModePayment["WALLET"] = "wallet";
    ModePayment["MOBILE_MONEY"] = "mobile_money";
    ModePayment["BANQUE"] = "banque";
})(ModePayment || (exports.ModePayment = ModePayment = {}));
let TransactionFrais = class TransactionFrais {
};
exports.TransactionFrais = TransactionFrais;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TransactionFrais.prototype, "id_frais", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TransactionFrais.prototype, "id_transaction", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TransactionFrais.prototype, "montant_frais", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20
    }),
    __metadata("design:type", String)
], TransactionFrais.prototype, "type_transaction", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20
    }),
    __metadata("design:type", String)
], TransactionFrais.prototype, "mode_paiement", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    }),
    __metadata("design:type", Date)
], TransactionFrais.prototype, "date_creation", void 0);
exports.TransactionFrais = TransactionFrais = __decorate([
    (0, typeorm_1.Entity)('transactions_frais')
], TransactionFrais);
//# sourceMappingURL=transaction-frais.entity.js.map