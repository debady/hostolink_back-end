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
exports.InvitationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const invitation_entity_1 = require("./entities/invitation.entity");
const crypto_1 = require("crypto");
const user_entity_1 = require("../utilisateur/entities/user.entity");
const invitation_traking_entity_1 = require("./entities/invitation_traking.entity");
const compte_entity_1 = require("../compte/entitie/compte.entity");
let InvitationService = class InvitationService {
    constructor(invitationRepository, userRepository, trackingRepository, compteRepository) {
        this.invitationRepository = invitationRepository;
        this.userRepository = userRepository;
        this.trackingRepository = trackingRepository;
        this.compteRepository = compteRepository;
    }
    async getOrCreateInvitation(id_user) {
        const existing = await this.invitationRepository.findOne({ where: { id_user } });
        if (existing) {
            return {
                code: existing.code_invitation,
                lien: `http://localhost:10000/invite/${existing.code_invitation}`,
            };
        }
        const randomCode = 'inv_' + (0, crypto_1.randomBytes)(4).toString('hex');
        const nouvelleInvitation = this.invitationRepository.create({
            id_user,
            code_invitation: randomCode,
        });
        await this.invitationRepository.save(nouvelleInvitation);
        return {
            code: nouvelleInvitation.code_invitation,
            lien: `http://localhost:10000/invite/${nouvelleInvitation.code_invitation}`,
        };
    }
    async enregistrerClic(code_invitation, ip, userAgent) {
        const invitation = await this.invitationRepository.findOne({ where: { code_invitation } });
        if (!invitation) {
            throw new common_1.NotFoundException("Code d'invitation introuvable");
        }
        const tracking = this.trackingRepository.create({
            code_invitation,
            ip_visiteur: ip,
            user_agent: userAgent,
        });
        await this.trackingRepository.save(tracking);
        invitation.nombre_clicks += 1;
        await this.invitationRepository.save(invitation);
    }
    async incrementerNombrePartages(code_invitation) {
        const invitation = await this.invitationRepository.findOne({ where: { code_invitation } });
        if (!invitation) {
            throw new common_1.NotFoundException("Code d'invitation introuvable");
        }
        invitation.nombre_partages += 1;
        await this.invitationRepository.save(invitation);
        return { message: 'Partage comptabilisé avec succès' };
    }
};
exports.InvitationService = InvitationService;
exports.InvitationService = InvitationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invitation_entity_1.Invitation)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(invitation_traking_entity_1.InvitationTracking)),
    __param(3, (0, typeorm_1.InjectRepository)(compte_entity_1.Compte)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InvitationService);
//# sourceMappingURL=invitation.service.js.map