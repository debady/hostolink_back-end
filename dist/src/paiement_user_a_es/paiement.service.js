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
exports.PaiementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let PaiementService = class PaiementService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async lireInfosParQr(token) {
        if (!token) {
            throw new common_1.BadRequestException('Token requis');
        }
        const [qrValide] = await this.dataSource.query(`SELECT id_qrcode, short_id, id_user_etablissement_sante 
       FROM qr_code_paiement_dynamique 
       WHERE token = $1 AND statut = 'actif' AND date_expiration > NOW()
       LIMIT 1`, [token]);
        if (!qrValide) {
            throw new common_1.NotFoundException('QR Code invalide ou expiré');
        }
        const [infosEtablissement] = await this.dataSource.query(`SELECT 
        u.nom AS nom,
        u.telephone,
        u.email,
        u.adresse,
        c.id_compte
       FROM user_etablissement_sante u
       JOIN compte c ON u.id_user_etablissement_sante = c.id_user_etablissement_sante
       WHERE u.id_user_etablissement_sante = $1
       LIMIT 1`, [qrValide.id_user_etablissement_sante]);
        if (!infosEtablissement) {
            throw new common_1.NotFoundException('Établissement lié au QR code introuvable');
        }
        return {
            id_qrcode: qrValide.id_qrcode,
            short_id: qrValide.short_id,
            id_user_etablissement_sante: qrValide.id_user_etablissement_sante,
            nom_etablissement: infosEtablissement.nom,
            telephone: infosEtablissement.telephone,
            email: infosEtablissement.email,
            adresse: infosEtablissement.adresse,
            id_compte_etablissement: infosEtablissement.id_compte,
        };
    }
    async payerParQr(shortId, idCompteEtablissement, montant, idUser) {
        let compteUtilisateur = null;
        let compteEtablissement = null;
        let idQrcode = null;
        try {
            if (!shortId || !idCompteEtablissement || !montant || !idUser) {
                throw new common_1.BadRequestException('Données manquantes pour effectuer le paiement');
            }
            const [qr] = await this.dataSource.query(`SELECT id_qrcode FROM qr_code_paiement_dynamique WHERE short_id = $1 LIMIT 1`, [shortId]);
            if (!qr) {
                throw new common_1.NotFoundException(`QR Code avec short_id "${shortId}" introuvable.`);
            }
            idQrcode = qr.id_qrcode;
            [compteUtilisateur] = await this.dataSource.query(`SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`, [idUser]);
            if (!compteUtilisateur) {
                throw new common_1.UnauthorizedException('Compte utilisateur introuvable');
            }
            if (compteUtilisateur.solde_compte < montant) {
                throw new common_1.BadRequestException('Solde insuffisant');
            }
            [compteEtablissement] = await this.dataSource.query(`SELECT * FROM compte WHERE id_compte = $1 LIMIT 1`, [idCompteEtablissement]);
            if (!compteEtablissement) {
                throw new common_1.NotFoundException('Compte établissement introuvable');
            }
            const frais = Math.floor(montant * 0);
            const montantFinal = montant - frais;
            await this.dataSource.transaction(async (manager) => {
                await manager.query(`UPDATE compte SET solde_compte = solde_compte - $1 WHERE id_compte = $2`, [montant, compteUtilisateur.id_compte]);
                await manager.query(`UPDATE compte SET solde_compte = solde_compte + $1 WHERE id_compte = $2`, [montantFinal, compteEtablissement.id_compte]);
                const insertTransaction = await manager.query(`INSERT INTO transaction_interne 
         (id_compte_expediteur, id_compte_recepteur, montant_envoyer, montant_recu, frais_preleve, devise_transaction, statut, type_transaction, id_qrcode_dynamique, id_etablissement_recepteur)
         VALUES ($1, $2, $3, $4, $5, 'XOF', 'effectué', 'paiement_qrcode', $6, $7)
         RETURNING id_transaction`, [
                    compteUtilisateur.id_compte,
                    compteEtablissement.id_compte,
                    montant,
                    montantFinal,
                    frais,
                    idQrcode,
                    compteEtablissement.id_user_etablissement_sante,
                ]);
                const idTransaction = insertTransaction[0].id_transaction;
                await manager.query(`INSERT INTO transactions_frais 
         (id_transaction, montant_frais, type_transaction, mode_paiement)
         VALUES ($1, $2, 'interne', 'wallet')`, [idTransaction, frais]);
                await manager.query(`UPDATE qr_code_paiement_dynamique SET statut = 'expiré' WHERE id_qrcode = $1`, [idQrcode]);
            });
            const [compteUserMaj] = await this.dataSource.query(`SELECT solde_compte FROM compte WHERE id_compte = $1`, [compteUtilisateur.id_compte]);
            const [etablissement] = await this.dataSource.query(`SELECT nom FROM user_etablissement_sante WHERE id_user_etablissement_sante = $1 LIMIT 1`, [compteEtablissement.id_user_etablissement_sante]);
            return {
                message: '✅ Paiement effectué avec succès',
                montant_envoyé: montant,
                montant_recu: montantFinal,
                frais_appliqués: frais,
                votre_nouveau_solde_est: compteUserMaj.solde_compte,
                etablissement_de_santé: etablissement?.nom ?? null,
            };
        }
        catch (error) {
            try {
                if (compteUtilisateur && compteEtablissement && idQrcode) {
                    await this.dataSource.query(`INSERT INTO transaction_interne
            (id_compte_expediteur, id_compte_recepteur, montant_envoyer, montant_recu, frais_preleve, devise_transaction, statut, type_transaction, id_qrcode_dynamique, id_etablissement_recepteur, motif_echec)
           VALUES ($1, $2, $3, $4, $5, 'XOF', 'echouee', 'paiement_qrcode', $6, $7, 'la transaction à échouée')`, [
                        compteUtilisateur.id_compte,
                        compteEtablissement.id_compte,
                        montant,
                        0,
                        0,
                        idQrcode,
                        compteEtablissement.id_user_etablissement_sante,
                        error.message,
                    ]);
                }
            }
            catch (saveError) {
                console.error('Erreur lors de l\'enregistrement de la transaction échouée:', saveError);
            }
            throw error;
        }
    }
    async payerParIdentifiant(identifiant, montant, idUser) {
        let compteUtilisateur = null;
        let compteEtablissement = null;
        let etab = null;
        let etabId = null;
        try {
            if (!identifiant || !montant || !idUser) {
                throw new common_1.BadRequestException('Données manquantes');
            }
            [etab] = await this.dataSource.query(`SELECT * FROM user_etablissement_sante 
       WHERE (email = $1 OR telephone = $1) AND compte_verifie = true LIMIT 1`, [identifiant]);
            if (!etab) {
                throw new common_1.NotFoundException("Établissement introuvable ou non vérifié");
            }
            etabId = etab.id_user_etablissement_sante;
            [compteUtilisateur] = await this.dataSource.query(`SELECT * FROM compte WHERE id_user = $1 AND statut = 'actif' LIMIT 1`, [idUser]);
            if (!compteUtilisateur) {
                throw new common_1.UnauthorizedException('Compte utilisateur introuvable');
            }
            if (compteUtilisateur.solde_compte < montant) {
                throw new common_1.BadRequestException('Solde insuffisant');
            }
            [compteEtablissement] = await this.dataSource.query(`SELECT * FROM compte WHERE id_user_etablissement_sante = $1 LIMIT 1`, [etabId]);
            if (!compteEtablissement) {
                throw new common_1.NotFoundException("Compte de l'établissement introuvable");
            }
            const frais = Math.floor(montant * 0);
            const montantFinal = montant - frais;
            await this.dataSource.transaction(async (manager) => {
                await manager.query(`UPDATE compte SET solde_compte = solde_compte - $1 WHERE id_compte = $2`, [montant, compteUtilisateur.id_compte]);
                await manager.query(`UPDATE compte SET solde_compte = solde_compte + $1 WHERE id_compte = $2`, [montantFinal, compteEtablissement.id_compte]);
                const insertTransaction = await manager.query(`INSERT INTO transaction_interne 
        (id_compte_expediteur, id_compte_recepteur, montant_envoyer, montant_recu, frais_preleve, devise_transaction, statut, type_transaction, id_etablissement_recepteur)
        VALUES ($1, $2, $3, $4, $5, 'XOF', 'effectué', 'paiement_contact', $6)
        RETURNING id_transaction`, [
                    compteUtilisateur.id_compte,
                    compteEtablissement.id_compte,
                    montant,
                    montantFinal,
                    frais,
                    etabId,
                ]);
                const idTransaction = insertTransaction[0].id_transaction;
                await manager.query(`INSERT INTO transactions_frais 
         (id_transaction, montant_frais, type_transaction, mode_paiement)
         VALUES ($1, $2, 'interne', 'wallet')`, [idTransaction, frais]);
            });
            const [soldeActuel] = await this.dataSource.query(`SELECT solde_compte FROM compte WHERE id_compte = $1`, [compteUtilisateur.id_compte]);
            const beneficiaire = {
                nom: etab.nom,
                telephone: etab.telephone,
                categorie: etab.categorie,
                email: etab.email,
            };
            const [photo] = await this.dataSource.query(`SELECT url_image FROM images 
       WHERE id_user_etablissement_sante = $1 AND motif = 'photo_profile' 
       ORDER BY date DESC LIMIT 1`, [etab.id_user_etablissement_sante]);
            return {
                message: '✅ Paiement effectué avec succès',
                identifiant_etablissement: identifiant,
                montant_envoyé: montant,
                montant_recu: montantFinal,
                frais_appliqués: frais,
                solde_restant: soldeActuel?.solde_compte || null,
                beneficiaire,
                photo: photo?.url_image ?? null,
            };
        }
        catch (error) {
            try {
                if (compteUtilisateur && compteEtablissement && etabId) {
                    await this.dataSource.query(`INSERT INTO transaction_interne
            (id_compte_expediteur, id_compte_recepteur, montant_envoyer, montant_recu, frais_preleve, devise_transaction, statut, type_transaction, id_etablissement_recepteur, motif_echec)
           VALUES ($1, $2, $3, $4, $5, 'XOF', 'echouée', 'paiement_contact', $6, 'la transaction à échouée')`, [
                        compteUtilisateur.id_compte,
                        compteEtablissement.id_compte,
                        montant,
                        0,
                        0,
                        etabId,
                        error.message,
                    ]);
                }
            }
            catch (saveError) {
                console.error('Erreur lors de l\'enregistrement de la transaction échouée:', saveError);
            }
            throw error;
        }
    }
};
exports.PaiementService = PaiementService;
exports.PaiementService = PaiementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], PaiementService);
//# sourceMappingURL=paiement.service.js.map