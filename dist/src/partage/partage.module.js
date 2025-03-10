"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const partage_controller_1 = require("./partage.controller");
const partage_service_1 = require("./partage.service");
const partage_entity_1 = require("./entities/partage.entity");
let PartageModule = class PartageModule {
};
exports.PartageModule = PartageModule;
exports.PartageModule = PartageModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([partage_entity_1.Partage])],
        controllers: [partage_controller_1.PartageController],
        providers: [partage_service_1.PartageService],
        exports: [partage_service_1.PartageService],
    })
], PartageModule);
//# sourceMappingURL=partage.module.js.map