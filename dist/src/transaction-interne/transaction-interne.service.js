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
exports.TransactionInterneService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const core_1 = require("@nestjs/core");
const transaction_interne_entity_1 = require("./entitie/transaction-interne.entity");
const transaction_frais_entity_1 = require("../transaction-frais/entite/transaction-frais.entity");
const user_entity_1 = require("../utilisateur/entities/user.entity");
const notif_push_service_1 = require("../module_notification_push/notif_push.service");
let TransactionInterneService = class TransactionInterneService {
    constructor(transactionRepository, transactionFraisRepository, dataSource, moduleRef, notificationService) {
        this.transactionRepository = transactionRepository;
        this.transactionFraisRepository = transactionFraisRepository;
        this.dataSource = dataSource;
        this.moduleRef = moduleRef;
        this.notificationService = notificationService;
    }
    calculerFrais(montant) {
        const tauxFrais = 0.02;
        return Math.round(montant * tauxFrais);
    }
    async getMyTransactions(userId) {
        return this.transactionRepository
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('utilisateur', 'envoyeur', 'transaction.id_utilisateur_envoyeur = envoyeur.id_user')
            .leftJoinAndSelect('utilisateur', 'recepteur', 'transaction.id_utilisateur_recepteur = recepteur.id_user')
            .select([
            'transaction.*',
            'recepteur.nom as nom_recepteur',
            'recepteur.prenom as prenom_recepteur'
        ])
            .where('transaction.id_utilisateur_envoyeur = :userId', { userId })
            .orWhere('transaction.id_utilisateur_recepteur = :userId', { userId })
            .orderBy('transaction.date_transaction', 'DESC')
            .getRawMany();
    }
    async getTransactionById(id) {
        if (isNaN(id) || id <= 0) {
            throw new common_1.BadRequestException('ID de transaction invalide');
        }
        const transaction = await this.transactionRepository
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('utilisateur', 'envoyeur', 'transaction.id_utilisateur_envoyeur = envoyeur.id_user')
            .leftJoinAndSelect('utilisateur', 'recepteur', 'transaction.id_utilisateur_recepteur = recepteur.id_user')
            .select([
            'transaction.*',
            'recepteur.nom as nom_recepteur',
            'recepteur.prenom as prenom_recepteur'
        ])
            .where('transaction.id_transaction = :id', { id })
            .getRawOne();
        if (!transaction) {
            throw new common_1.NotFoundException(`Transaction avec ID ${id} non trouvée`);
        }
        return transaction;
    }
    validateCriticalFields(transactionData) {
        if ((transactionData.statut === transaction_interne_entity_1.TransactionStatus.REUSSIE ||
            transactionData.statut === transaction_interne_entity_1.TransactionStatus.EN_ATTENTE) &&
            (!transactionData.id_compte_expediteur ||
                !transactionData.id_compte_recepteur ||
                transactionData.montant_envoyer == null ||
                transactionData.montant_recu == null)) {
            throw new common_1.BadRequestException("Impossible d'enregistrer une transaction réussie ou en attente avec des champs critiques manquants.");
        }
    }
    async createTransactionFromQrCode(userId, payWithQrDto) {
        const { token, montant_envoyer } = payWithQrDto;
        const qrCodeInfo = await this.getQrCodeInfoFromToken(token);
        if (!qrCodeInfo) {
            throw new common_1.NotFoundException(`token expiré `);
        }
        let isStatic = false;
        let isQrcodeDynamic = false;
        let idQrcode = null;
        let recipientId = null;
        if (qrCodeInfo.type === 'static') {
            isStatic = true;
            idQrcode = qrCodeInfo.id_qrcode;
            if (qrCodeInfo.id_user) {
                recipientId = qrCodeInfo.id_user;
            }
            else if (qrCodeInfo.id_user_etablissement_sante) {
                recipientId = qrCodeInfo.id_user_etablissement_sante;
            }
        }
        else {
            isQrcodeDynamic = true;
            idQrcode = qrCodeInfo.id_qrcode;
            if (qrCodeInfo.id_user) {
                recipientId = qrCodeInfo.id_user;
            }
            else if (qrCodeInfo.id_user_etablissement_sante) {
                recipientId = qrCodeInfo.id_user_etablissement_sante;
            }
        }
        if (recipientId === userId) {
            throw new common_1.BadRequestException('Vous ne pouvez pas effectuer un paiement à vous-même');
        }
        const compteExpéditeur = await this.getCompteByUserId(userId);
        if (!compteExpéditeur) {
            throw new common_1.NotFoundException('Compte de l\'expéditeur non trouvé');
        }
        let compteRecepteur;
        let id_utilisateur_recepteur;
        let id_etablissement_recepteur;
        let id_etablissement_envoyeur;
        let typeTransaction = transaction_interne_entity_1.TransactionType.PAIEMENT;
        if (qrCodeInfo.id_user) {
            compteRecepteur = await this.getCompteByUserId(qrCodeInfo.id_user);
            id_utilisateur_recepteur = qrCodeInfo.id_user;
        }
        else if (qrCodeInfo.id_user_etablissement_sante) {
            throw new common_1.BadRequestException('Les paiements aux établissements de santé ne sont pas encore disponibles');
        }
        else {
            throw new common_1.NotFoundException('Destinataire invalide dans le QR code');
        }
        if (!compteRecepteur) {
            throw new common_1.NotFoundException('Compte du bénéficiaire non trouvé');
        }
        const frais = montant_envoyer * 0;
        const montantRecu = montant_envoyer - frais;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transactionData = {
                id_compte_expediteur: compteExpéditeur.id_compte,
                id_utilisateur_envoyeur: userId,
                id_utilisateur_recepteur,
                montant_envoyer: montant_envoyer,
                montant_recu: montantRecu,
                frais_preleve: frais,
                statut: transaction_interne_entity_1.TransactionStatus.EN_ATTENTE,
                devise_transaction: compteExpéditeur.devise,
                type_transaction: typeTransaction,
                id_compte_recepteur: compteRecepteur.id_compte,
            };
            if (isStatic) {
                transactionData.id_qrcode_statique = idQrcode;
            }
            else if (isQrcodeDynamic) {
                transactionData.id_qrcode_dynamique = idQrcode;
            }
            this.validateCriticalFields(transactionData);
            const newTransaction = this.transactionRepository.create(transactionData);
            const savedTransaction = await queryRunner.manager.save(newTransaction);
            const transactionFraisData = {
                id_transaction: savedTransaction.id_transaction,
                montant_frais: frais,
                type_transaction: transaction_frais_entity_1.TransactionFraisType.INTERNE,
                mode_paiement: transaction_frais_entity_1.ModePayment.WALLET,
            };
            const newTransactionFrais = this.transactionFraisRepository.create(transactionFraisData);
            await queryRunner.manager.save(newTransactionFrais);
            await this.executeTransaction(queryRunner, compteExpéditeur.id_compte, compteRecepteur.id_compte, montant_envoyer, montantRecu, savedTransaction.id_transaction);
            await queryRunner.commitTransaction();
            if (userId && compteExpéditeur?.user?.fcm_token) {
                await this.notificationService.sendToToken(compteExpéditeur.user.fcm_token, 'Transaction envoyée ✅', `Vous avez envoyé ${montant_envoyer} ${compteExpéditeur.devise}`);
            }
            if (id_utilisateur_recepteur && compteRecepteur?.user?.fcm_token) {
                await this.notificationService.sendToToken(compteRecepteur.user.fcm_token, 'Vous avez reçu un paiement 💸', `Vous avez reçu ${montantRecu} ${compteRecepteur.devise}`);
            }
            return {
                success: true,
                message: 'Transaction effectuée avec succès',
                data: {
                    id_transaction: savedTransaction.id_transaction,
                    montant_total: montant_envoyer,
                    frais: frais,
                    montant_recu: montantRecu,
                    statut: savedTransaction.statut,
                    date_transaction: savedTransaction.date_transaction
                }
            };
        }
        catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            try {
                const failedTransactionData = {
                    id_compte_expediteur: compteExpéditeur?.id_compte,
                    id_utilisateur_envoyeur: userId,
                    id_utilisateur_recepteur,
                    montant_envoyer: montant_envoyer,
                    montant_recu: 0,
                    frais_preleve: frais,
                    statut: transaction_interne_entity_1.TransactionStatus.ECHOUEE,
                    devise_transaction: compteExpéditeur?.devise,
                    type_transaction: typeTransaction,
                    id_compte_recepteur: compteRecepteur?.id_compte,
                    motif_echec: 'Transaction échouée: ' + (error?.message || 'Erreur inconnue')
                };
                if (isStatic) {
                    failedTransactionData.id_qrcode_statique = idQrcode;
                }
                else if (isQrcodeDynamic) {
                    failedTransactionData.id_qrcode_dynamique = idQrcode;
                }
                await queryRunner.manager.save(this.transactionRepository.create(failedTransactionData));
            }
            catch (saveError) {
                console.error('Erreur lors de l\'enregistrement de la transaction échouée:', saveError);
            }
            await queryRunner.rollbackTransaction();
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Erreur lors de la transaction: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async createTransactionFromPhone(userId, payWithPhoneDto) {
        const { telephone, montant_envoyer, description } = payWithPhoneDto;
        let destinationUser = null;
        try {
            destinationUser = await this.dataSource.manager.findOne('utilisateur', {
                where: {
                    telephone,
                    actif: true
                }
            });
        }
        catch (error) {
            console.error("Erreur lors de la recherche d'utilisateur:", error);
        }
        if (!destinationUser) {
            throw new common_1.NotFoundException(`Aucun utilisateur trouvé avec le numéro ${telephone}`);
        }
        if (destinationUser && destinationUser.id_user === userId) {
            throw new common_1.BadRequestException('Vous ne pouvez pas effectuer un paiement à vous-même');
        }
        const compteExpéditeur = await this.getCompteByUserId(userId);
        if (!compteExpéditeur) {
            throw new common_1.NotFoundException('Compte de l\'expéditeur non trouvé');
        }
        let compteRecepteur;
        let id_utilisateur_recepteur;
        let typeTransaction = transaction_interne_entity_1.TransactionType.TRANSFERT;
        if (destinationUser) {
            compteRecepteur = await this.getCompteByUserId(destinationUser.id_user);
            id_utilisateur_recepteur = destinationUser.id_user;
        }
        else {
            throw new common_1.NotFoundException('Aucun destinataire trouvé avec ce numéro');
        }
        if (!compteRecepteur) {
            throw new common_1.NotFoundException('Compte du bénéficiaire non trouvé');
        }
        const frais = montant_envoyer * 0;
        const montantRecu = montant_envoyer - frais;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transactionData = {
                id_compte_expediteur: compteExpéditeur.id_compte,
                id_utilisateur_envoyeur: userId,
                id_utilisateur_recepteur,
                montant_envoyer: montant_envoyer,
                montant_recu: montantRecu,
                frais_preleve: frais,
                statut: transaction_interne_entity_1.TransactionStatus.EN_ATTENTE,
                devise_transaction: compteExpéditeur.devise,
                type_transaction: typeTransaction,
                id_compte_recepteur: compteRecepteur.id_compte,
            };
            this.validateCriticalFields(transactionData);
            const newTransaction = this.transactionRepository.create(transactionData);
            const savedTransaction = await queryRunner.manager.save(newTransaction);
            const transactionFraisData = {
                id_transaction: savedTransaction.id_transaction,
                montant_frais: frais,
                type_transaction: transaction_frais_entity_1.TransactionFraisType.INTERNE,
                mode_paiement: transaction_frais_entity_1.ModePayment.WALLET,
            };
            const newTransactionFrais = this.transactionFraisRepository.create(transactionFraisData);
            await queryRunner.manager.save(newTransactionFrais);
            await this.executeTransaction(queryRunner, compteExpéditeur.id_compte, compteRecepteur.id_compte, montant_envoyer, montantRecu, savedTransaction.id_transaction);
            let nomDestinataire = '';
            if (destinationUser) {
                nomDestinataire = `${destinationUser.prenom || ''} ${destinationUser.nom || ''}`.trim();
            }
            await queryRunner.commitTransaction();
            return {
                success: true,
                message: `Vous avez envoyé ${montant_envoyer} F CFA à ${nomDestinataire}`,
                data: {
                    id_transaction: savedTransaction.id_transaction,
                    montant_total: montant_envoyer,
                    frais: frais,
                    montant_recu: montantRecu,
                    statut: savedTransaction.statut,
                    date_transaction: savedTransaction.date_transaction
                }
            };
        }
        catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            try {
                const failedTransactionData = {
                    id_compte_expediteur: compteExpéditeur?.id_compte,
                    id_utilisateur_envoyeur: userId,
                    id_utilisateur_recepteur,
                    montant_envoyer: montant_envoyer,
                    montant_recu: 0,
                    frais_preleve: frais,
                    statut: transaction_interne_entity_1.TransactionStatus.ECHOUEE,
                    devise_transaction: compteExpéditeur?.devise,
                    type_transaction: typeTransaction,
                    id_compte_recepteur: compteRecepteur?.id_compte,
                    motif_echec: (`Transaction échouée:  + (error?.message || 'Erreur inconnue')`)
                };
                await this.transactionRepository.save(failedTransactionData);
            }
            catch (saveError) {
                console.error('Erreur lors de l\'enregistrement de la transaction échouée:', saveError);
            }
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Erreur lors de la transaction: ${error.message}`);
        }
    }
    async createTransactionFromEmail(userId, payWithEmailDto) {
        const { email, montant_envoyer, description } = payWithEmailDto;
        let destinationUser = null;
        try {
            destinationUser = await this.dataSource.manager.findOne('utilisateur', {
                where: {
                    email,
                    actif: true
                }
            });
        }
        catch (error) {
            console.error("Erreur lors de la recherche d'utilisateur par email:", error);
        }
        if (!destinationUser) {
            throw new common_1.NotFoundException(`Aucun utilisateur trouvé avec l'email ${email}`);
        }
        if (destinationUser && destinationUser.id_user === userId) {
            throw new common_1.BadRequestException('Vous ne pouvez pas effectuer un paiement à vous-même');
        }
        const compteExpéditeur = await this.getCompteByUserId(userId);
        if (!compteExpéditeur) {
            throw new common_1.NotFoundException('Compte de l\'expéditeur non trouvé');
        }
        let compteRecepteur;
        let id_utilisateur_recepteur;
        let id_etablissement_recepteur;
        let id_etablissement_envoyeur;
        let typeTransaction = transaction_interne_entity_1.TransactionType.TRANSFERT;
        if (destinationUser) {
            compteRecepteur = await this.getCompteByUserId(destinationUser.id_user);
            id_utilisateur_recepteur = destinationUser.id_user;
        }
        else {
            throw new common_1.NotFoundException('Aucun destinataire trouvé avec cet email');
        }
        if (!compteRecepteur) {
            throw new common_1.NotFoundException('Compte du bénéficiaire non trouvé');
        }
        const frais = montant_envoyer * 0;
        const montantRecu = montant_envoyer - frais;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const transactionData = {
                id_compte_expediteur: compteExpéditeur.id_compte,
                id_utilisateur_envoyeur: userId,
                id_utilisateur_recepteur,
                montant_envoyer: montant_envoyer,
                montant_recu: montantRecu,
                frais_preleve: frais,
                statut: transaction_interne_entity_1.TransactionStatus.EN_ATTENTE,
                devise_transaction: compteExpéditeur.devise,
                type_transaction: typeTransaction,
                id_compte_recepteur: compteRecepteur.id_compte,
            };
            this.validateCriticalFields(transactionData);
            const newTransaction = this.transactionRepository.create(transactionData);
            const savedTransaction = await queryRunner.manager.save(newTransaction);
            const transactionFraisData = {
                id_transaction: savedTransaction.id_transaction,
                montant_frais: frais,
                type_transaction: transaction_frais_entity_1.TransactionFraisType.INTERNE,
                mode_paiement: transaction_frais_entity_1.ModePayment.WALLET,
            };
            const newTransactionFrais = this.transactionFraisRepository.create(transactionFraisData);
            await queryRunner.manager.save(newTransactionFrais);
            await this.executeTransaction(queryRunner, compteExpéditeur.id_compte, compteRecepteur.id_compte, montant_envoyer, montantRecu, savedTransaction.id_transaction);
            let nomDestinataire = '';
            if (destinationUser) {
                nomDestinataire = `${destinationUser.prenom || ''} ${destinationUser.nom || ''}`.trim();
            }
            await queryRunner.commitTransaction();
            return {
                success: true,
                message: `Vous avez envoyé ${montant_envoyer} F CFA à ${nomDestinataire}`,
                data: {
                    id_transaction: savedTransaction.id_transaction,
                    montant_total: montant_envoyer,
                    frais: frais,
                    montant_recu: montantRecu,
                    statut: savedTransaction.statut,
                    date_transaction: savedTransaction.date_transaction
                }
            };
        }
        catch (error) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            try {
                const failedTransactionData = {
                    id_compte_expediteur: compteExpéditeur?.id_compte,
                    id_utilisateur_envoyeur: userId,
                    id_utilisateur_recepteur,
                    montant_envoyer: montant_envoyer,
                    montant_recu: 0,
                    frais_preleve: frais,
                    statut: transaction_interne_entity_1.TransactionStatus.ECHOUEE,
                    devise_transaction: compteExpéditeur?.devise,
                    type_transaction: typeTransaction,
                    id_compte_recepteur: compteRecepteur?.id_compte,
                    motif_echec: (`Transaction échouée:  + (error?.message || 'Erreur inconnue')`)
                };
                await this.transactionRepository.save(failedTransactionData);
            }
            catch (saveError) {
                console.error('Erreur lors de l\'enregistrement de la transaction échouée:', saveError);
            }
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Erreur lors de la transaction: ${error.message}`);
        }
    }
    async cancelTransaction(id, userId) {
        const transaction = await this.transactionRepository.findOne({
            where: { id_transaction: id }
        });
        if (!transaction) {
            throw new common_1.NotFoundException(`Transaction avec ID ${id} non trouvée`);
        }
        if (transaction.id_utilisateur_envoyeur !== userId) {
            throw new common_1.BadRequestException('Vous ne pouvez annuler que vos propres transactions');
        }
        if (transaction.statut !== transaction_interne_entity_1.TransactionStatus.EN_ATTENTE) {
            throw new common_1.BadRequestException('Seules les transactions en attente peuvent être annulées');
        }
        transaction.statut = transaction_interne_entity_1.TransactionStatus.ANNULEE;
        return this.transactionRepository.save(transaction);
    }
    async rollbackTransaction(id, userId, rollbackDto) {
        const originalTransaction = await this.transactionRepository.findOne({
            where: { id_transaction: id }
        });
        if (!originalTransaction) {
            throw new common_1.NotFoundException(`Transaction avec ID ${id} non trouvée`);
        }
        if (originalTransaction.statut !== transaction_interne_entity_1.TransactionStatus.REUSSIE) {
            throw new common_1.BadRequestException('Seules les transactions réussies peuvent être remboursées');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const compteOriginalRecepteur = await this.getCompteById(originalTransaction.id_compte_recepteur);
            const compteOriginalExpediteur = await this.getCompteById(originalTransaction.id_compte_expediteur);
            if (!compteOriginalRecepteur || !compteOriginalExpediteur) {
                throw new common_1.NotFoundException('Un des comptes impliqués dans la transaction n\'existe plus');
            }
            if (compteOriginalRecepteur.solde_compte < originalTransaction.montant_recu) {
                throw new common_1.BadRequestException('Le bénéficiaire n\'a pas assez de fonds pour effectuer le remboursement');
            }
            const montantADebiter = originalTransaction.montant_recu;
            const montantACrediter = originalTransaction.montant_recu;
            const motifEchec = (`Transaction échouée:  + (error?.message || 'Erreur inconnue')`);
            const remboursementData = {
                id_compte_expediteur: originalTransaction.id_compte_recepteur,
                id_utilisateur_envoyeur: originalTransaction.id_utilisateur_recepteur,
                id_utilisateur_recepteur: originalTransaction.id_utilisateur_envoyeur,
                montant_envoyer: montantADebiter,
                montant_recu: montantACrediter,
                frais_preleve: 0,
                statut: transaction_interne_entity_1.TransactionStatus.EN_ATTENTE,
                devise_transaction: originalTransaction.devise_transaction,
                type_transaction: transaction_interne_entity_1.TransactionType.REMBOURSEMENT,
                id_compte_recepteur: originalTransaction.id_compte_expediteur,
                motif_echec: motifEchec
            };
            const newRollbackTransaction = this.transactionRepository.create(remboursementData);
            const savedRollbackTransaction = await queryRunner.manager.save(newRollbackTransaction);
            await this.executeTransaction(queryRunner, originalTransaction.id_compte_recepteur, originalTransaction.id_compte_expediteur, montantADebiter, montantACrediter, savedRollbackTransaction.id_transaction);
            if (rollbackDto.motif) {
                await queryRunner.manager.update('transaction_interne', { id_transaction: savedRollbackTransaction.id_transaction }, { motif_annulation: `Remboursement administratif de transaction ID: ${id}: ${rollbackDto.motif}` });
            }
            try {
                await queryRunner.manager.update('transaction_interne', { id_transaction: savedRollbackTransaction.id_transaction }, { transaction_liee: id });
            }
            catch (error) {
                console.warn('Impossible de définir transaction_liee, le champ n\'existe peut-être pas:', error.message);
            }
            await queryRunner.commitTransaction();
            return {
                success: true,
                message: 'Remboursement administratif effectué avec succès',
                data: {
                    id_transaction_originale: id,
                    id_transaction_remboursement: savedRollbackTransaction.id_transaction,
                    montant_rembourse: montantACrediter,
                    frais: 0,
                    statut: savedRollbackTransaction.statut,
                    date_transaction: savedRollbackTransaction.date_transaction
                }
            };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof common_1.NotFoundException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Erreur lors du remboursement: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async executeTransaction(queryRunner, id_compte_expediteur, id_compte_recepteur, montant_total, montant_recu, id_transaction) {
        const compteExpéditeur = await queryRunner.manager.findOne('compte', {
            where: { id_compte: id_compte_expediteur }
        });
        if (!compteExpéditeur || compteExpéditeur.solde_compte < montant_total) {
            throw new common_1.BadRequestException('Solde insuffisant pour effectuer cette transaction');
        }
        await queryRunner.manager.decrement('compte', { id_compte: id_compte_expediteur }, 'solde_compte', montant_total);
        await queryRunner.manager.increment('compte', { id_compte: id_compte_recepteur }, 'solde_compte', montant_recu);
        await queryRunner.manager.update('transaction_interne', { id_transaction: id_transaction }, { statut: transaction_interne_entity_1.TransactionStatus.REUSSIE });
    }
    async getQrCodeInfoFromToken(token) {
        try {
            const qrCodeDynamique = await this.dataSource.manager.findOne('qr_code_paiement_dynamique', {
                where: { token }
            });
            if (qrCodeDynamique) {
                return {
                    id_qrcode: qrCodeDynamique.id_qrcode,
                    id_user: qrCodeDynamique.id_user,
                    id_user_etablissement_sante: qrCodeDynamique.id_user_etablissement_sante,
                    type: 'dynamic'
                };
            }
            const qrCodeStatique = await this.dataSource.manager.findOne('qr_code_paiement_statique', {
                where: { token }
            });
            if (qrCodeStatique) {
                return {
                    id_qrcode: qrCodeStatique.id_qrcode,
                    id_user: qrCodeStatique.id_user,
                    id_user_etablissement_sante: qrCodeStatique.id_user_etablissement_sante,
                    type: 'static'
                };
            }
            return null;
        }
        catch (error) {
            console.error("Erreur lors de la récupération du QR code:", error);
            return null;
        }
    }
    async getCompteByUserId(userId) {
        try {
            const compte = await this.dataSource.manager.findOne('compte', {
                where: { id_user: userId }
            });
            return compte;
        }
        catch (error) {
            console.error(`Erreur lors de la récupération du compte pour l'utilisateur ${userId}:`, error);
            return null;
        }
    }
    async getCompteById(id_compte) {
        try {
            const compte = await this.dataSource.manager.findOne('compte', {
                where: { id_compte }
            });
            return compte;
        }
        catch (error) {
            console.error(`Erreur lors de la récupération du compte ${id_compte}:`, error);
            return null;
        }
    }
    async getStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 6);
        weekStart.setHours(0, 0, 0, 0);
        const monthStart = new Date();
        monthStart.setDate(monthStart.getDate() - 29);
        monthStart.setHours(0, 0, 0, 0);
        const yearStart = new Date();
        yearStart.setDate(yearStart.getDate() - 364);
        yearStart.setHours(0, 0, 0, 0);
        const statsByStatus = await this.transactionRepository.createQueryBuilder('transaction')
            .select('transaction.statut', 'statut')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(transaction.montant_envoyer)', 'total_motant_envoyer')
            .addSelect('SUM(transaction.montant_recu)', 'total_montant_recu')
            .groupBy('transaction.statut')
            .getRawMany();
        const statsByType = await this.transactionRepository.createQueryBuilder('transaction')
            .select('transaction.type_transaction', 'type')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(transaction.montant_envoyer)', 'total_motant_envoyer')
            .addSelect('SUM(transaction.montant_recu)', 'total_montant_recu')
            .groupBy('transaction.type_transaction')
            .getRawMany();
        const totalStats = await this.transactionRepository.createQueryBuilder('transaction')
            .select('COUNT(*)', 'count')
            .addSelect('SUM(transaction.montant_envoyer)', 'total_motant_envoyer')
            .addSelect('SUM(transaction.montant_recu)', 'total_montant_recu')
            .getRawOne();
        const dailyStats = await this.transactionRepository.createQueryBuilder('transaction')
            .select('COUNT(*)', 'count')
            .addSelect('SUM(transaction.montant_envoyer)', 'total_motant_envoyer')
            .addSelect('SUM(transaction.montant_recu)', 'total_montant_recu')
            .where('transaction.date_transaction >= :startDate', { startDate: today })
            .andWhere('transaction.date_transaction < :endDate', { endDate: tomorrow })
            .getRawOne();
        const weeklyStats = await this.transactionRepository.createQueryBuilder('transaction')
            .select('COUNT(*)', 'count')
            .addSelect('SUM(transaction.montant_envoyer)', 'total_motant_envoyer')
            .addSelect('SUM(transaction.montant_recu)', 'total_montant_recu')
            .where('transaction.date_transaction >= :startDate', { startDate: weekStart })
            .andWhere('transaction.date_transaction < :endDate', { endDate: tomorrow })
            .getRawOne();
        const monthlyStats = await this.transactionRepository.createQueryBuilder('transaction')
            .select('COUNT(*)', 'count')
            .addSelect('SUM(transaction.montant_envoyer)', 'total_motant_envoyer')
            .addSelect('SUM(transaction.montant_recu)', 'total_montant_recu')
            .where('transaction.date_transaction >= :startDate', { startDate: monthStart })
            .andWhere('transaction.date_transaction < :endDate', { endDate: tomorrow })
            .getRawOne();
        const yearlyStats = await this.transactionRepository.createQueryBuilder('transaction')
            .select('COUNT(*)', 'count')
            .addSelect('SUM(transaction.montant_envoyer)', 'total_motant_envoyer')
            .addSelect('SUM(transaction.montant_recu)', 'total_montant_recu')
            .where('transaction.date_transaction >= :startDate', { startDate: yearStart })
            .andWhere('transaction.date_transaction < :endDate', { endDate: tomorrow })
            .getRawOne();
        const dailyDetail = await this.transactionRepository.createQueryBuilder('transaction')
            .select("to_char(transaction.date_transaction, 'DD-MM-YYYY')", 'date')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(transaction.montant_envoyer)', 'total_motant_envoyer')
            .addSelect('SUM(transaction.montant_recu)', 'total_montant_recu')
            .where('transaction.date_transaction >= :startDate', { startDate: weekStart })
            .groupBy("to_char(transaction.date_transaction, 'DD-MM-YYYY')")
            .orderBy('date', 'ASC')
            .getRawMany();
        const monthlyDetail = await this.transactionRepository.createQueryBuilder('transaction')
            .select("to_char(transaction.date_transaction, 'MM-YYYY')", 'month')
            .addSelect('COUNT(*)', 'count')
            .addSelect('SUM(transaction.montant_envoyer)', 'total_motant_envoyer')
            .addSelect('SUM(transaction.montant_recu)', 'total_montant_recu')
            .where('transaction.date_transaction >= :startDate', { startDate: yearStart })
            .groupBy("to_char(transaction.date_transaction, 'MM-YYYY')")
            .orderBy('month', 'ASC')
            .getRawMany();
        const avgTransaction = await this.transactionRepository.createQueryBuilder('transaction')
            .select('AVG(transaction.montant_envoyer)', 'avg')
            .addSelect('AVG(transaction.montant_recu)', 'avg')
            .getRawOne();
        return {
            montant_total_des_transactions: totalStats,
            statistique_par_statut: statsByStatus,
            statistique_par_type: statsByType,
            montant_moyen_des_transactions: avgTransaction?.avg || 0,
            periodes: {
                statistique_par_jour: dailyStats,
                statistique_par_semaine: weeklyStats,
                statistique_par_mois: monthlyStats,
                statistique_par_an: yearlyStats,
            },
            details: {
                jounalier: dailyDetail,
                mensuel: monthlyDetail
            },
        };
    }
    async getUserInfoFromQrCode(token) {
        const qrCodeInfo = await this.getQrCodeInfoFromToken(token);
        if (!qrCodeInfo) {
            throw new common_1.NotFoundException('QR Code invalide ou expiré');
        }
        let userInfo = null;
        if (qrCodeInfo.id_user) {
            userInfo = await this.dataSource.manager.findOne(user_entity_1.User, {
                where: { id_user: qrCodeInfo.id_user },
                relations: ['images'],
                select: ['id_user', 'nom', 'prenom', 'telephone', 'email', 'actif']
            });
        }
        if (!userInfo) {
            throw new common_1.NotFoundException('Utilisateur du QR Code non trouvé');
        }
        let photoProfile = null;
        if (userInfo.images && userInfo.images.length > 0) {
            photoProfile = userInfo.images[0].url_image || 'https://res.cloudinary.com/dhrrk7vsd/image/upload/v1740668911/hostolink/i2d0l0c0tb13shazdu7l.jpg';
        }
        return {
            success: true,
            message: 'Données du destinataire récupérées',
            data: {
                id_user: userInfo.id_user,
                nom: userInfo.nom,
                prenom: userInfo.prenom,
                telephone: userInfo.telephone,
                email: userInfo.email,
                photo_profile: photoProfile,
            }
        };
    }
};
exports.TransactionInterneService = TransactionInterneService;
exports.TransactionInterneService = TransactionInterneService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_interne_entity_1.Transaction)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_frais_entity_1.TransactionFrais)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        core_1.ModuleRef,
        notif_push_service_1.NotificationService])
], TransactionInterneService);
//# sourceMappingURL=transaction-interne.service.js.map