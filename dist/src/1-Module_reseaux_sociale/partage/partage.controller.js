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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartageController = void 0;
const common_1 = require("@nestjs/common");
const partage_service_1 = require("./partage.service");
const partage_dto_1 = require("./dto/partage.dto");
const passport_1 = require("@nestjs/passport");
let PartageController = class PartageController {
    constructor(partageService) {
        this.partageService = partageService;
    }
    create(createPartageDto) {
        return this.partageService.create(createPartageDto);
    }
    findByPublication(id_publication) {
        return this.partageService.findByPublication(id_publication);
    }
    findByUser(id_user) {
        return this.partageService.findByUser(id_user);
    }
    findByEtablissement(id_etablissement) {
        return this.partageService.findByEtablissement(id_etablissement);
    }
    findByAdmin(id_admin) {
        return this.partageService.findByAdmin(id_admin);
    }
    findByExpert(id_expert) {
        return this.partageService.findByExpert(id_expert);
    }
    async getSharedPublication(uniqueId) {
        const partage = await this.partageService.findByUniqueId(uniqueId);
        await this.partageService.incrementClics(partage.id_partage);
        return {
            partage,
            publication: partage.publication,
        };
    }
    async countByPublication(id_publication) {
        const count = await this.partageService.countByPublication(id_publication);
        return { count };
    }
    getPublicationShareStats(id_publication) {
        return this.partageService.getPublicationShareStats(id_publication);
    }
};
exports.PartageController = PartageController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [partage_dto_1.CreatePartageDto]),
    __metadata("design:returntype", Promise)
], PartageController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('publication/:id_publication'),
    __param(0, (0, common_1.Param)('id_publication', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PartageController.prototype, "findByPublication", null);
__decorate([
    (0, common_1.Get)('user/:id_user'),
    __param(0, (0, common_1.Param)('id_user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PartageController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('etablissement/:id_etablissement'),
    __param(0, (0, common_1.Param)('id_etablissement', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PartageController.prototype, "findByEtablissement", null);
__decorate([
    (0, common_1.Get)('admin/:id_admin'),
    __param(0, (0, common_1.Param)('id_admin', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PartageController.prototype, "findByAdmin", null);
__decorate([
    (0, common_1.Get)('expert/:id_expert'),
    __param(0, (0, common_1.Param)('id_expert', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PartageController.prototype, "findByExpert", null);
__decorate([
    (0, common_1.Get)('shared/:uniqueId'),
    __param(0, (0, common_1.Param)('uniqueId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PartageController.prototype, "getSharedPublication", null);
__decorate([
    (0, common_1.Get)('count/publication/:id_publication'),
    __param(0, (0, common_1.Param)('id_publication', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PartageController.prototype, "countByPublication", null);
__decorate([
    (0, common_1.Get)('stats/publication/:id_publication'),
    __param(0, (0, common_1.Param)('id_publication', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PartageController.prototype, "getPublicationShareStats", null);
exports.PartageController = PartageController = __decorate([
    (0, common_1.Controller)('partage'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [partage_service_1.PartageService])
], PartageController);
//# sourceMappingURL=partage.controller.js.map