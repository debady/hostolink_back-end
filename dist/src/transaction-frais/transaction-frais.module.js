"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionFraisModule = void 0;
const common_1 = require("@nestjs/common");
const transaction_frais_controller_1 = require("./transaction-frais.controller");
const transaction_frais_service_1 = require("./transaction-frais.service");
const transaction_frais_entity_1 = require("./transaction-frais.entity");
const typeorm_1 = require("@nestjs/typeorm");
let TransactionFraisModule = class TransactionFraisModule {
};
exports.TransactionFraisModule = TransactionFraisModule;
exports.TransactionFraisModule = TransactionFraisModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([transaction_frais_entity_1.TransactionFrais]),
        ],
        controllers: [transaction_frais_controller_1.TransactionFraisController],
        providers: [transaction_frais_service_1.TransactionFraisService],
        exports: [transaction_frais_service_1.TransactionFraisService]
    })
], TransactionFraisModule);
//# sourceMappingURL=transaction-frais.module.js.map