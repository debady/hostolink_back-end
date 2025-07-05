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
exports.QrDynamiqueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto = __importStar(require("crypto"));
const qr_code_paiement_dynamique_entity_1 = require("./entities/qr_code_paiement_dynamique.entity");
const transaction_entity_1 = require("./entities/transaction.entity");
let QrDynamiqueService = class QrDynamiqueService {
    constructor(dataSource, qrRepo, transactionRepo) {
        this.dataSource = dataSource;
        this.qrRepo = qrRepo;
        this.transactionRepo = transactionRepo;
    }
    onModuleInit() {
        this.startQrGenerationLoop();
    }
    generateShortId() {
        return crypto.randomBytes(8).toString('hex');
    }
    startQrGenerationLoop() {
        setInterval(async () => {
            try {
                const etablissements = await this.dataSource.query(`
        SELECT id_user_etablissement_sante FROM user_etablissement_sante
      `);
                for (const etab of etablissements) {
                    const id = etab.id_user_etablissement_sante;
                    let qr = await this.qrRepo.findOne({
                        where: {
                            id_user_etablissement_sante: id,
                            statut: 'actif',
                        },
                    });
                    const token = this.generateToken();
                    const expiration = new Date(Date.now() + 60 * 1000);
                    const valeur = `HST_DYNAMIC_${id}_${token}`;
                    const short_id = this.generateShortId();
                    if (qr) {
                        qr.qr_code_valeur = valeur;
                        qr.date_expiration = expiration;
                        qr.date_creation = new Date();
                        qr.token = token;
                        qr.short_id = short_id;
                        await this.qrRepo.save(qr);
                    }
                    else {
                        qr = this.qrRepo.create({
                            qr_code_valeur: valeur,
                            date_expiration: expiration,
                            date_creation: new Date(),
                            statut: 'actif',
                            token,
                            short_id,
                            id_user_etablissement_sante: id,
                        });
                        await this.qrRepo.save(qr);
                    }
                }
            }
            catch (err) {
                console.error('❌ Erreur QR dynamique :', err.message);
            }
        }, 60 * 1000);
    }
    async getQrActifOuNouveau(idEtablissement) {
        const now = new Date();
        let actif = await this.qrRepo.findOne({
            where: {
                id_user_etablissement_sante: idEtablissement,
                statut: 'actif',
                date_expiration: (0, typeorm_2.MoreThan)(now),
            },
        });
        if (actif) {
            return actif;
        }
        const token = this.generateToken();
        const expiration = new Date(now.getTime() + 60 * 1000);
        const valeur = `HST_DYNAMIC_${idEtablissement}_${token}`;
        const short_id = this.generateShortId();
        const qr = this.qrRepo.create({
            qr_code_valeur: valeur,
            date_expiration: expiration,
            date_creation: now,
            statut: 'actif',
            token,
            short_id,
            id_user_etablissement_sante: idEtablissement,
        });
        const saved = await this.qrRepo.save(qr);
        return saved;
    }
    async validerQrEtInvalider(token) {
        const qr = await this.qrRepo.findOne({
            where: { token, statut: 'actif' },
        });
        if (!qr)
            throw new common_1.NotFoundException('QR code invalide ou expiré');
        if (qr.date_expiration.getTime() < new Date().getTime()) {
            throw new common_1.BadRequestException('QR code expiré');
        }
        qr.statut = 'expiré';
        await this.qrRepo.save(qr);
        return {
            message: 'QR Code validé avec succès',
            etablissement_id: qr.id_user_etablissement_sante,
        };
    }
    generateToken() {
        return crypto.randomBytes(16).toString('hex');
    }
};
exports.QrDynamiqueService = QrDynamiqueService;
exports.QrDynamiqueService = QrDynamiqueService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(qr_code_paiement_dynamique_entity_1.QrCodePaiementDynamique)),
    __param(2, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QrDynamiqueService);
//# sourceMappingURL=qr-dynamique.service_es.js.map