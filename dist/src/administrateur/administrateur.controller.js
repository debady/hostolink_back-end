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
exports.AdministrateurController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const create_administrateur_dto_1 = require("./dto/create-administrateur.dto");
const administrateur_service_1 = require("./administrateur.service");
const login_administrateur_dto_1 = require("./dto/login-administrateur.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const typeorm_1 = require("typeorm");
let AdministrateurController = class AdministrateurController {
    constructor(administrateurService, adminService, dataSource) {
        this.administrateurService = administrateurService;
        this.adminService = adminService;
        this.dataSource = dataSource;
    }
    async inscrireAdmin(dto) {
        try {
            return await this.adminService.inscrireAdministrateur(dto);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async login(dto) {
        try {
            return await this.adminService.connexionAdministrateur(dto);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async getMe(req) {
        return this.adminService.getAdminById(req.user.id_admin_gestionnaire);
    }
    async uploadAvatar(id, avatar) {
        try {
            return await this.adminService.uploadAvatarAdmin(id, avatar);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async supprimerAdministrateur(id) {
        return this.adminService.supprimerAdministrateur(id);
    }
    async supprimerAdminParSuperAdmin(id, req) {
        if (req.user.role !== 'super_admin') {
            throw new common_1.UnauthorizedException('Accès réservé au super administrateur.');
        }
        return this.adminService.supprimerAdministrateur(id);
    }
    async modifierStatutAdmin(id, statut, req) {
        if (req.user.role !== 'super_admin') {
            throw new common_1.UnauthorizedException('Accès réservé au super administrateur.');
        }
        return this.adminService.modifierStatutAdministrateur(id, statut);
    }
    async modifierAdministrateur(id, dto, req) {
        if (req.user.role !== 'super_admin') {
            throw new common_1.UnauthorizedException('Accès réservé au super administrateur.');
        }
        return this.adminService.modifierAdministrateur(id, dto);
    }
    async recupererAdmins(req) {
        if (req.user.role !== 'super_admin') {
            throw new common_1.UnauthorizedException('Accès réservé au super administrateur.');
        }
        return this.adminService.recupererTousLesAdmins();
    }
    async afficherDetailsAdmin(id, req) {
        if (req.user.role !== 'super_admin') {
            throw new common_1.UnauthorizedException('Accès réservé au super administrateur.');
        }
        return this.adminService.getAdminById(id);
    }
    async modifierMotDePasse(id, nouveauMotDePasse, req) {
        if (req.user.role !== 'super_admin') {
            throw new common_1.UnauthorizedException('Accès réservé au super administrateur.');
        }
        return this.adminService.modifierMotDePasseAdmin(id, nouveauMotDePasse);
    }
    async attribuerPermissions(id, permissions, req) {
        if (req.user.role !== 'super_admin') {
            throw new common_1.UnauthorizedException('Accès réservé au super administrateur.');
        }
        return this.adminService.modifierPermissionsAdmin(id, permissions);
    }
    async rechercherAdminParRole(role, req) {
        if (req.user.role !== 'super_admin') {
            throw new common_1.UnauthorizedException('Accès réservé au super administrateur.');
        }
        return this.adminService.rechercherParRole(role);
    }
    async crediterUtilisateur(req, body) {
        const idAdmin = req.user.id_admin_gestionnaire;
        return this.adminService.crediterUtilisateur(body.id_user, body.montant, idAdmin);
    }
    async crediterEtablissement(id, montant, req) {
        if (!id || !montant) {
            throw new common_1.BadRequestException('ID et montant requis');
        }
        return this.administrateurService.crediterEtablissement(id, montant, req.user.id_admin_gestionnaire);
    }
    async getAllEtablissements() {
        return this.administrateurService.findAllEtablissements();
    }
    rechargerUser(req, body) {
        return this.adminService.rechargerUser(body.identifiant, body.montant, req.user.id_admin_gestionnaire);
    }
    rechargerEtablissement(req, body) {
        return this.adminService.rechargerEtablissement(body.identifiant, body.montant, req.user.id_admin_gestionnaire);
    }
    getAllRechargements() {
        return this.administrateurService.getAllRechargements();
    }
    getTotalFraisTransactions() {
        return this.administrateurService.getTotalFraisTransactions();
    }
    async findUser(req, identifiant, type) {
        return this.adminService.rechercherUtilisateurParIdentifiant(identifiant, type);
    }
    async verifierTokenDynamique(token) {
        const [qr] = await this.dataSource.query(`SELECT * FROM qr_code_paiement_dynamique WHERE token = $1 LIMIT 1`, [token]);
        if (!qr)
            throw new common_1.NotFoundException("QR dynamique introuvable");
        return { id_user: qr.id_user };
    }
    async verifierTokenStatique(token) {
        const [qr] = await this.dataSource.query(`SELECT * FROM qr_code_paiement_statique WHERE token = $1 LIMIT 1`, [token]);
        if (!qr)
            throw new common_1.NotFoundException("QR statique introuvable");
        return { id_user: qr.id_user };
    }
    async retirerUser(req, body) {
        const { identifiant, montant } = body;
        const idAdmin = req.user.id_admin_gestionnaire;
        const user = await this.adminService.rechercherUtilisateurParIdentifiant(identifiant, 'uuid');
        return this.adminService.retirerUtilisateur(user.id_user, montant, idAdmin);
    }
    async retirerEtablissement(req, body) {
        const { identifiant, montant } = body;
        const idAdmin = req.user.id_admin_gestionnaire;
        const [etab] = await this.dataSource.query(`SELECT * FROM user_etablissement_sante WHERE email = $1 OR telephone = $1 OR id_user_etablissement_sante::text = $1 LIMIT 1`, [identifiant]);
        if (!etab)
            throw new common_1.NotFoundException('Établissement introuvable');
        return this.adminService.retirerEtablissement(etab.id_user_etablissement_sante, montant, idAdmin);
    }
};
exports.AdministrateurController = AdministrateurController;
__decorate([
    (0, common_1.Post)('inscription'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_administrateur_dto_1.CreateAdministrateurDto]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "inscrireAdmin", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_administrateur_dto_1.LoginAdministrateurDto]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "getMe", null);
__decorate([
    (0, common_1.Post)(':id/avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatar', { dest: './uploads' })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "supprimerAdministrateur", null);
__decorate([
    (0, common_1.Delete)(':id/supprimer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "supprimerAdminParSuperAdmin", null);
__decorate([
    (0, common_1.Patch)(':id/statut'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('statut')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "modifierStatutAdmin", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "modifierAdministrateur", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "recupererAdmins", null);
__decorate([
    (0, common_1.Get)(':id/details'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "afficherDetailsAdmin", null);
__decorate([
    (0, common_1.Patch)(':id/mot-de-passe'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('nouveau_mot_de_passe')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "modifierMotDePasse", null);
__decorate([
    (0, common_1.Patch)(':id/permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('permissions')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "attribuerPermissions", null);
__decorate([
    (0, common_1.Get)('role/:role'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Param)('role')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "rechercherAdminParRole", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    (0, common_1.Post)('crediter-utilisateur'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "crediterUtilisateur", null);
__decorate([
    (0, common_1.Post)('crediter-etablissement'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Body)('id_etab')),
    __param(1, (0, common_1.Body)('montant')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "crediterEtablissement", null);
__decorate([
    (0, common_1.Get)('etablissements'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "getAllEtablissements", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    (0, common_1.Post)('recharger-user'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdministrateurController.prototype, "rechargerUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    (0, common_1.Post)('recharger-etablissement'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdministrateurController.prototype, "rechargerEtablissement", null);
__decorate([
    (0, common_1.Get)('rechargements'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdministrateurController.prototype, "getAllRechargements", null);
__decorate([
    (0, common_1.Get)('transactions/frais-total'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdministrateurController.prototype, "getTotalFraisTransactions", null);
__decorate([
    (0, common_1.Get)('utilisateur/find'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('identifiant')),
    __param(2, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "findUser", null);
__decorate([
    (0, common_1.Get)('qr-code-dynamique/verifier'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "verifierTokenDynamique", null);
__decorate([
    (0, common_1.Get)('qr-code-statique/verifier'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "verifierTokenStatique", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    (0, common_1.Post)('retirer-user'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "retirerUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAdminGuard),
    (0, common_1.Post)('retirer-etablissement'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdministrateurController.prototype, "retirerEtablissement", null);
exports.AdministrateurController = AdministrateurController = __decorate([
    (0, common_1.Controller)('administrateurs'),
    __metadata("design:paramtypes", [administrateur_service_1.AdministrateurService,
        administrateur_service_1.AdministrateurService,
        typeorm_1.DataSource])
], AdministrateurController);
//# sourceMappingURL=administrateur.controller.js.map