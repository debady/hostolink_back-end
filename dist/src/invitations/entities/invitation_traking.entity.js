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
exports.InvitationTracking = void 0;
const typeorm_1 = require("typeorm");
const invitation_entity_1 = require("./invitation.entity");
let InvitationTracking = class InvitationTracking {
};
exports.InvitationTracking = InvitationTracking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InvitationTracking.prototype, "id_tracking", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], InvitationTracking.prototype, "code_invitation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], InvitationTracking.prototype, "ip_visiteur", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], InvitationTracking.prototype, "user_agent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], InvitationTracking.prototype, "date_click", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => invitation_entity_1.Invitation, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'code_invitation', referencedColumnName: 'code_invitation' }),
    __metadata("design:type", invitation_entity_1.Invitation)
], InvitationTracking.prototype, "invitation", void 0);
exports.InvitationTracking = InvitationTracking = __decorate([
    (0, typeorm_1.Entity)('invitation_tracking')
], InvitationTracking);
//# sourceMappingURL=invitation_traking.entity.js.map