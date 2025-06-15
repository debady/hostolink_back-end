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
exports.Transaction = exports.TransactionType = exports.TransactionStatus = void 0;
const compte_entity_1 = require("../../compte/entitie/compte.entity");
const typeorm_1 = require("typeorm");
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["EN_ATTENTE"] = "en attente";
    TransactionStatus["REUSSIE"] = "r\u00E9ussie";
    TransactionStatus["ECHOUEE"] = "\u00E9chou\u00E9e";
    TransactionStatus["ANNULEE"] = "annul\u00E9e";
    TransactionStatus["REMBOURSEE"] = "rembours\u00E9e";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType["TRANSFERT"] = "transfert";
    TransactionType["PAIEMENT"] = "paiement";
    TransactionType["REMBOURSEMENT"] = "remboursement";
    TransactionType["RECHARGE"] = "recharge";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
let Transaction = class Transaction {
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Transaction.prototype, "id_transaction", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transaction.prototype, "id_compte_expediteur", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Transaction.prototype, "id_utilisateur_envoyeur", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Transaction.prototype, "id_utilisateur_recepteur", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "id_etablissement_recepteur", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "id_etablissement_envoyeur", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', { precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Transaction.prototype, "montant_envoyer", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', { precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Transaction.prototype, "montant_recu", void 0);
__decorate([
    (0, typeorm_1.Column)('numeric', { precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "frais_preleve", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: TransactionStatus.EN_ATTENTE
    }),
    __metadata("design:type", String)
], Transaction.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "devise_transaction", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "motif_annulation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "type_transaction", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    }),
    __metadata("design:type", Date)
], Transaction.prototype, "date_transaction", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "id_qrcode_dynamique", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Transaction.prototype, "id_qrcode_statique", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Transaction.prototype, "id_compte_recepteur", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => compte_entity_1.Compte),
    (0, typeorm_1.JoinColumn)({ name: 'id_compte_expediteur' }),
    __metadata("design:type", compte_entity_1.Compte)
], Transaction.prototype, "compteExpediteur", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => compte_entity_1.Compte),
    (0, typeorm_1.JoinColumn)({ name: 'id_compte_recepteur' }),
    __metadata("design:type", compte_entity_1.Compte)
], Transaction.prototype, "compteRecepteur", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)('transaction_interne')
], Transaction);
//# sourceMappingURL=transaction.entity.js.map