"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const QRCode = __importStar(require("qrcode"));
const crypto = __importStar(require("crypto"));
const qr_code_dynamique_entity_1 = require("./entitie/qr_code_dynamique.entity");
const qr_code_statique_entity_1 = require("./entitie/qr_code_statique.entity");
const qr_code_payload_interface_1 = require("./interface_qr_code/qr-code-payload.interface");
const compte_service_1 = require("../compte/compte.service");
const user_service_1 = require("../utilisateur/user.service");
const cleanup_service_1 = require("./cleanup.service");
let QrCodeService = class QrCodeService {
    constructor(qrCodeDynamiqueRepository, qrCodeStatiqueRepository, jwtService, configService, compteService, userService, cleanupService) {
        this.qrCodeDynamiqueRepository = qrCodeDynamiqueRepository;
        this.qrCodeStatiqueRepository = qrCodeStatiqueRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.compteService = compteService;
        this.userService = userService;
        this.cleanupService = cleanupService;
    }
    generateShortId() {
        return crypto.randomBytes(8).toString('hex');
    }
    generateTokenWithPayload(payload) {
        const options = {
            secret: this.configService.get('JWT_QR_SECRET', 'qr_code_secret_key'),
        };
        if (payload.qrType === qr_code_payload_interface_1.QrCodeType.DYNAMIC && payload.expiresAt) {
            const expiresInSeconds = Math.floor((payload.expiresAt - payload.timestamp) / 1000);
            if (expiresInSeconds > 0) {
                options.expiresIn = `${expiresInSeconds}s`;
            }
        }
        return this.jwtService.sign(payload, options);
    }
    createUserPayload(id_user, isDynamic, expiresIn, additionalInfo) {
        const timestamp = Date.now();
        const payload = {
            recipientType: qr_code_payload_interface_1.RecipientType.USER,
            recipientId: id_user,
            qrType: isDynamic ? qr_code_payload_interface_1.QrCodeType.DYNAMIC : qr_code_payload_interface_1.QrCodeType.STATIC,
            timestamp,
            ...additionalInfo
        };
        if (isDynamic && expiresIn) {
            payload.expiresAt = timestamp + (expiresIn * 1000);
        }
        return payload;
    }
    async createStaticQrForNewUser(id_user, accountNumber) {
        const existingQrCode = await this.qrCodeStatiqueRepository.findOne({
            where: { id_user }
        });
        if (existingQrCode) {
            return existingQrCode;
        }
        const payload = this.createUserPayload(id_user, false, undefined, { accountNumber });
        const token = this.generateTokenWithPayload(payload);
        const shortId = this.generateShortId();
        const qrCode = this.qrCodeStatiqueRepository.create({
            id_user,
            token,
            short_id: shortId,
            statut: 'actif',
        });
        return this.qrCodeStatiqueRepository.save(qrCode);
    }
    async getUserStaticQrCode(id_user) {
        return this.qrCodeStatiqueRepository.findOne({
            where: { id_user, statut: 'actif' }
        });
    }
    async createDynamicQrForUser(id_user, accountNumber, expiresIn = 60, currency) {
        const payload = this.createUserPayload(id_user, true, expiresIn, { accountNumber, currency });
        const token = this.generateTokenWithPayload(payload);
        const shortId = this.generateShortId();
        const dateExpiration = new Date(payload.expiresAt || Date.now() + (expiresIn * 1000));
        const qrCode = this.qrCodeDynamiqueRepository.create({
            id_user,
            token,
            short_id: shortId,
            date_expiration: dateExpiration,
            statut: 'actif',
        });
        const savedQrCode = await this.qrCodeDynamiqueRepository.save(qrCode);
        this.cleanupService.scheduleQrCodeUpdate(savedQrCode);
        return savedQrCode;
    }
    async deleteOldExpiredQrCodes(days = 7) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const result = await this.qrCodeDynamiqueRepository.delete({
            date_expiration: (0, typeorm_2.LessThan)(cutoffDate)
        });
        return result.affected || 0;
    }
    verifyToken(token) {
        try {
            const decoded = this.jwtService.decode(token);
            const options = {
                secret: this.configService.get('JWT_QR_SECRET', 'qr_code_secret_key'),
            };
            if (decoded && decoded.qrType === qr_code_payload_interface_1.QrCodeType.STATIC) {
                options.ignoreExpiration = true;
            }
            else {
                options.ignoreExpiration = false;
            }
            return this.jwtService.verify(token, options);
        }
        catch (error) {
            throw new common_1.BadRequestException('Token invalide ou expiré');
        }
    }
    async refreshAllStaticQrCodes() {
        const staticQrCodes = await this.qrCodeStatiqueRepository.find({
            where: { statut: 'actif' }
        });
        let updatedCount = 0;
        for (const qrCode of staticQrCodes) {
            try {
                const compte = await this.compteService.getUserCompte(qrCode.id_user);
                const accountNumber = compte ? compte.numero_compte : undefined;
                const payload = this.createUserPayload(qrCode.id_user, false, undefined, { accountNumber });
                const token = this.generateTokenWithPayload(payload);
                qrCode.token = token;
                await this.qrCodeStatiqueRepository.save(qrCode);
                updatedCount++;
            }
            catch (error) {
                console.error(`Erreur lors du rafraîchissement du QR code statique ${qrCode.id_qrcode}: ${error.message}`);
            }
        }
        return updatedCount;
    }
    async refreshQrCodeToken(qrCode) {
        try {
            const compte = await this.compteService.getUserCompte(qrCode.id_user);
            const accountNumber = compte ? compte.numero_compte : undefined;
            const currency = compte ? compte.devise : undefined;
            const payload = this.createUserPayload(qrCode.id_user, true, 60, { accountNumber, currency });
            const token = this.generateTokenWithPayload(payload);
            qrCode.token = token;
            qrCode.date_expiration = new Date(payload.expiresAt || Date.now() + (60 * 1000));
            await this.qrCodeDynamiqueRepository.save(qrCode);
            this.cleanupService.scheduleQrCodeUpdate(qrCode);
        }
        catch (error) {
            console.error(`Erreur lors du rafraîchissement du token: ${error.message}`);
        }
    }
    async validateQrCode(codeInput) {
        try {
            let qrCode = null;
            let payload;
            const staticQrCode = await this.qrCodeStatiqueRepository.findOne({
                where: { short_id: codeInput }
            });
            if (staticQrCode) {
                if (staticQrCode.statut !== 'actif') {
                    throw new common_1.BadRequestException('QR code inactif');
                }
                try {
                    payload = this.verifyToken(staticQrCode.token);
                    qrCode = staticQrCode;
                }
                catch (error) {
                    throw new common_1.BadRequestException('Token invalide');
                }
            }
            else {
                const dynamicQrCode = await this.qrCodeDynamiqueRepository.findOne({
                    where: { short_id: codeInput }
                });
                if (dynamicQrCode) {
                    if (dynamicQrCode.statut !== 'actif') {
                        throw new common_1.BadRequestException('QR code inactif');
                    }
                    const now = new Date();
                    if (now > dynamicQrCode.date_expiration) {
                        throw new common_1.BadRequestException('QR code expiré');
                    }
                    try {
                        payload = this.verifyToken(dynamicQrCode.token);
                        qrCode = dynamicQrCode;
                    }
                    catch (error) {
                        throw new common_1.BadRequestException('le Token est invalide');
                    }
                }
                else {
                    try {
                        payload = this.verifyToken(codeInput);
                        const isDynamic = payload.qrType === qr_code_payload_interface_1.QrCodeType.DYNAMIC;
                        if (isDynamic) {
                            qrCode = await this.qrCodeDynamiqueRepository.findOne({
                                where: { token: codeInput }
                            });
                        }
                        else {
                            qrCode = await this.qrCodeStatiqueRepository.findOne({
                                where: { token: codeInput }
                            });
                        }
                        if (!qrCode) {
                            throw new common_1.NotFoundException('QR code non trouvé avec ce token');
                        }
                        if (qrCode.statut !== 'actif') {
                            throw new common_1.BadRequestException('QR code inactif');
                        }
                    }
                    catch (error) {
                        throw new common_1.BadRequestException('token expiré');
                    }
                }
            }
            const id_user = payload.recipientType === qr_code_payload_interface_1.RecipientType.USER ? payload.recipientId : undefined;
            let userInfo = null;
            if (id_user) {
                const user = await this.userService.getUserById(id_user);
                const compte = await this.compteService.getUserCompte(id_user);
                if (user && compte) {
                    userInfo = {
                        identifiant: user.id_user,
                        nom: user.nom,
                        prenom: user.prenom,
                        numero_compte: compte.numero_compte
                    };
                }
                else {
                }
            }
            const result = {
                ...payload,
                id_qrcode: qrCode.id_qrcode,
                short_id: qrCode.short_id,
                creation_date: qrCode.date_creation,
                utilisateur: userInfo
            };
            return result;
        }
        catch (error) {
            console.error(`Erreur finale dans validateQrCode: ${error.message}`);
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Erreur de validation du QR code: ' + error.message);
        }
    }
    async generateQrCodeImage(idOrToken) {
        try {
            return await QRCode.toDataURL(idOrToken);
        }
        catch (error) {
            throw new common_1.BadRequestException('Erreur lors de la génération de l\'image QR code');
        }
    }
    async refreshUserDynamicQrCode(id_user, accountNumber, expiresIn = 60, currency) {
        try {
            const existingQrCode = await this.qrCodeDynamiqueRepository.findOne({
                where: { id_user, statut: 'actif' },
                order: { date_creation: 'DESC' }
            });
            if (existingQrCode) {
                const payload = this.createUserPayload(id_user, true, expiresIn, { accountNumber, currency });
                const token = this.generateTokenWithPayload(payload);
                existingQrCode.token = token;
                existingQrCode.date_expiration = new Date(payload.expiresAt || Date.now() + (expiresIn * 1000));
                const updatedQrCode = await this.qrCodeDynamiqueRepository.save(existingQrCode);
                this.cleanupService.scheduleQrCodeUpdate(updatedQrCode);
                return updatedQrCode;
            }
            return this.createDynamicQrForUser(id_user, accountNumber, expiresIn, currency);
        }
        catch (error) {
            console.error('Erreur lors du rafraîchissement du QR code:', error);
            throw new common_1.BadRequestException('Impossible de rafraîchir le QR code: ' + error.message);
        }
    }
    async getUserDynamicQrCodes(id_user) {
        let userQRCode = await this.qrCodeDynamiqueRepository.findOne({
            where: { id_user, statut: 'actif' },
            order: { date_creation: 'DESC' }
        });
        if (!userQRCode) {
            const compte = await this.compteService.getUserCompte(id_user);
            userQRCode = await this.createDynamicQrForUser(id_user, compte?.numero_compte, 60, compte?.devise);
            return [userQRCode];
        }
        const now = new Date();
        if (now > userQRCode.date_expiration) {
            await this.refreshQrCodeToken(userQRCode);
        }
        return [userQRCode];
    }
    async getAllUserQrCodes(id_user) {
        const staticQrCodes = await this.qrCodeStatiqueRepository.find({
            where: {
                id_user,
                statut: 'actif'
            }
        });
        const dynamicQrCodes = await this.getUserDynamicQrCodes(id_user);
        return {
            static: staticQrCodes,
            dynamic: dynamicQrCodes
        };
    }
    async getQrCodeById(id_qrcode, type) {
        if (type === 'static') {
            return this.qrCodeStatiqueRepository.findOne({
                where: { id_qrcode }
            });
        }
        else {
            const qrCode = await this.qrCodeDynamiqueRepository.findOne({
                where: { id_qrcode }
            });
            if (qrCode && qrCode.statut === 'actif') {
                const now = new Date();
                if (now > qrCode.date_expiration) {
                    await this.refreshQrCodeToken(qrCode);
                }
            }
            return qrCode;
        }
    }
};
exports.QrCodeService = QrCodeService;
exports.QrCodeService = QrCodeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(qr_code_dynamique_entity_1.QrCodeDynamique)),
    __param(1, (0, typeorm_1.InjectRepository)(qr_code_statique_entity_1.QrCodeStatique)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => compte_service_1.CompteService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __param(6, (0, common_1.Inject)((0, common_1.forwardRef)(() => cleanup_service_1.CleanupService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService,
        compte_service_1.CompteService,
        user_service_1.UserService,
        cleanup_service_1.CleanupService])
], QrCodeService);
//# sourceMappingURL=qr-code.service.js.map