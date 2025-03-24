// src/transaction/transaction.service.ts
import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, LessThan } from 'typeorm';
import { CompteService } from '../compte/compte.service';
import { QrCodeService } from '../qr-code/qr-code.service';
import { ModePaiement, TransactionFrais, TypeTransactionFrais } from 'src/transaction-frais/entite/transaction-frais.entity';
import { Transaction, TransactionStatus, TransactionType } from './entitie/transaction-interne.entity';
import { CreateTransactionDto } from './dto/transaction-interne.dto';
import { User } from 'src/utilisateur/entities/user.entity';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class TransactionInterneService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionFrais)
    private readonly transactionFraisRepository: Repository<TransactionFrais>,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => CompteService))
    private readonly compteService: CompteService,
    @Inject(forwardRef(() => QrCodeService))
    private readonly qrCodeService: QrCodeService,
    private readonly moduleRef: ModuleRef
  ) {}

  /**
   * Crée une transaction à partir des informations d'un QR code
   */
  async createTransactionFromQrCode(
    id_user_source: string,
    token: string,
    montant: number
  ): Promise<Transaction> {
    // Valider le QR code
    const qrCodeData = await this.qrCodeService.validateQrCode(token);
    
    if (!qrCodeData) {
      throw new BadRequestException('QR code invalide');
    }
    
    // Récupérer les informations du compte source (expéditeur)
    const compteExpediteur = await this.compteService.getUserCompte(id_user_source);
    if (!compteExpediteur) {
      throw new NotFoundException("Compte expéditeur non trouvé");
    }
    
    // Vérifier que le compte expéditeur a suffisamment de fonds
    if (compteExpediteur.solde_compte < montant) {
      throw new BadRequestException('Solde insuffisant');
    }
    
    // Récupérer les informations du compte destination (récepteur)
    const recipientId = qrCodeData.recipientId;
    let compteRecepteur;
    let typeTransaction = TransactionType.PAIEMENT_QRCODE;
    let id_utilisateur_recepteur: number | undefined = undefined;
    let id_etablissement_recepteur: number | undefined = undefined;
    let id_user_etablissement_sante: number | undefined = undefined;
    
    // Déterminer le type de transaction en fonction des entités impliquées
    if (qrCodeData.recipientType === 'user') {
      compteRecepteur = await this.compteService.getUserCompte(recipientId as string);
      
      // Vérifier si nous pouvons convertir l'ID en nombre
      const numericId = this.tryParseUserId(recipientId as string);
      if (numericId) {
        id_utilisateur_recepteur = numericId;
      }
    } else {
      // Pour l'établissement de santé (commenté car non développé)
      throw new BadRequestException('Transactions avec établissements de santé non disponibles pour le moment');
      /* 
      compteRecepteur = await this.compteService.getEtablissementCompte(recipientId as number);
      id_etablissement_recepteur = recipientId as number;
      id_user_etablissement_sante = recipientId as number;
      */
    }
    
    if (!compteRecepteur) {
      throw new NotFoundException("Compte récepteur non trouvé");
    }
    
    // Récupérer l'id_qrcode à partir du token
    let id_qrcode: number | undefined = undefined;
    try {
      const qrCodeInfo = await this.getQrCodeInfoFromToken(token);
      if (qrCodeInfo && qrCodeInfo.id_qrcode) {
        id_qrcode = qrCodeInfo.id_qrcode;
      }
    } catch (error) {
      // Ignorer l'erreur, id_qrcode restera undefined
      console.log("Impossible de récupérer l'id_qrcode:", error.message);
    }
    
    // Créer la transaction avec un statut EN_ATTENTE
    const transaction = await this.createTransaction({
      id_compte_expediteur: compteExpediteur.id_compte,
      id_compte_recepteur: compteRecepteur.id_compte,
      id_utilisateur_recepteur,
      id_etablissement_recepteur,
      montant,
      devise_transaction: compteExpediteur.devise, // Utiliser la devise du compte expéditeur
      type_transaction: typeTransaction,
      id_qrcode,
      id_user_etablissement_sante
    });
    
    // Exécuter la transaction immédiatement
    return await this.executeTransaction(transaction.id_transaction);
  }

  /**
   * Récupère les informations d'un QR code à partir de son token
   * @private
   */
  private async getQrCodeInfoFromToken(token: string): Promise<{ id_qrcode?: number } | null> {
    // Cette méthode peut être implémentée selon la structure de votre QrCodeService
    // Si votre QrCodeService n'a pas de méthode getQrCodeByToken, utilisez cette solution de contournement
    try {
        // Essayez d'abord de chercher dans la table QR code dynamique
        const qrCodeDynamique = await this.dataSource.manager.findOne('qr_code_paiement_dynamique', {
          where: { token }
        }) as any; // Utiliser any pour éviter les erreurs de typage
        
        if (qrCodeDynamique && qrCodeDynamique.id_qrcode) {
          return { id_qrcode: qrCodeDynamique.id_qrcode };
        }
        
        // Sinon, cherchez dans la table QR code statique
        const qrCodeStatique = await this.dataSource.manager.findOne('qr_code_paiement_statique', {
          where: { token }
        }) as any; // Utiliser any pour éviter les erreurs de typage
        
        if (qrCodeStatique && qrCodeStatique.id_qrcode) {
          return { id_qrcode: qrCodeStatique.id_qrcode };
        }
        
        return null;
      } catch (error) {
        console.error("Erreur lors de la récupération du QR code:", error);
        return null;
      }
    }

  /**
   * Tente de convertir un ID utilisateur (UUID) en entier
   * @private
   */
  private tryParseUserId(userId: string): number | undefined {
    try {
      const numeric = parseInt(userId, 10);
      if (!isNaN(numeric)) {
        return numeric;
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Crée une transaction à partir du numéro de téléphone du destinataire
   */
  async createTransactionFromPhone(
    id_user_source: string,
    telephone: string,
    montant: number,
    description?: string
  ): Promise<Transaction> {
    // Rechercher l'utilisateur par numéro de téléphone
    const userService = this.moduleRef.get('UserService', { strict: false });
    let destinationUser: User | null = null;
    let etablissementSante: any = null;
    let typeTransaction = TransactionType.TRANSFERT;
    
    // Chercher d'abord parmi les utilisateurs
    try {
      destinationUser = await userService.findUserByPhone(telephone);
    } catch (error) {
      // Utilisateur non trouvé, on va chercher dans les établissements
    }
    
    // Si pas d'utilisateur trouvé, chercher parmi les établissements de santé
    if (!destinationUser) {
      try {
        const etablissementService = this.moduleRef.get('EtablissementSanteService', { strict: false });
        etablissementSante = await etablissementService.findByPhone(telephone);
      } catch (error) {
        // Établissement non trouvé non plus
        throw new NotFoundException(`Aucun utilisateur ou établissement trouvé avec le numéro ${telephone}`);
      }
    }
    
    // Récupérer les informations du compte source (expéditeur)
    const compteExpediteur = await this.compteService.getUserCompte(id_user_source);
    if (!compteExpediteur) {
      throw new NotFoundException("Compte expéditeur non trouvé");
    }
    
    // Vérifier que le compte expéditeur a suffisamment de fonds
    if (compteExpediteur.solde_compte < montant) {
      throw new BadRequestException('Solde insuffisant');
    }
    
    // Récupérer les informations du compte destination (récepteur)
    let compteRecepteur;
    let id_utilisateur_recepteur: number | undefined = undefined;
    let id_etablissement_recepteur: number | undefined = undefined;
    let id_user_etablissement_sante: number | undefined = undefined;
    
    if (destinationUser) {
      // Transaction vers un utilisateur
      compteRecepteur = await this.compteService.getUserCompte(destinationUser.id_user);
      
      // Essayer de convertir l'ID utilisateur en nombre si nécessaire
      const numericId = this.tryParseUserId(destinationUser.id_user);
      if (numericId) {
        id_utilisateur_recepteur = numericId;
      }
    } else if (etablissementSante) {
      // Transaction vers un établissement de santé
      // Commenté car le module n'est pas encore développé
      throw new BadRequestException('Transactions avec établissements de santé non disponibles pour le moment');
      /*
      compteRecepteur = await this.compteService.getEtablissementCompte(etablissementSante.id_user_etablissement_sante);
      id_etablissement_recepteur = etablissementSante.id_etablissement;
      id_user_etablissement_sante = etablissementSante.id_user_etablissement_sante;
      */
    }
    
    if (!compteRecepteur) {
      throw new NotFoundException("Compte récepteur non trouvé");
    }
    
    // Créer la transaction avec un statut EN_ATTENTE
    const transaction = await this.createTransaction({
      id_compte_expediteur: compteExpediteur.id_compte,
      id_compte_recepteur: compteRecepteur.id_compte,
      id_utilisateur_recepteur,
      id_etablissement_recepteur,
      montant,
      devise_transaction: compteExpediteur.devise,
      type_transaction: typeTransaction,
      id_user_etablissement_sante
    });
    
    // Exécuter la transaction immédiatement
    return await this.executeTransaction(transaction.id_transaction);
  }

  /**
   * Crée une nouvelle transaction avec le statut EN_ATTENTE
   */
  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Calcul des frais de transaction (0.5% du montant total)
      // Le montant saisi est le montant total, les frais seront déduits de ce montant
      const frais = parseFloat((createTransactionDto.montant * 0.005).toFixed(2));
      
      // Créer la transaction
      const transaction = this.transactionRepository.create({
        ...createTransactionDto,
        frais_transaction: frais,
        statut: TransactionStatus.EN_ATTENTE
      });
      
      // Sauvegarder la transaction
      const savedTransaction = await queryRunner.manager.save(transaction);
      
      // Créer l'entrée dans la table transactions_frais
      const transactionFrais = this.transactionFraisRepository.create({
        id_transaction: savedTransaction.id_transaction,
        montant_frais: frais,
        type_transaction: TypeTransactionFrais.INTERNE,
        mode_paiement: ModePaiement.WALLET
      });
      
      // Sauvegarder les frais de transaction
      await queryRunner.manager.save(transactionFrais);
      
      // Valider la transaction de base de données
      await queryRunner.commitTransaction();
      
      return savedTransaction;
    } catch (error) {
      // En cas d'erreur, annuler tous les changements
      await queryRunner.rollbackTransaction();
      
      throw new InternalServerErrorException(
        `Erreur lors de la création de la transaction: ${error.message}`
      );
    } finally {
      // Libérer les ressources
      await queryRunner.release();
    }
  }

  /**
   * Exécute une transaction existante (mise à jour des soldes)
   */
  async executeTransaction(id_transaction: number): Promise<Transaction> {
    // Utiliser une transaction de base de données pour garantir l'intégrité
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Récupérer la transaction
      const transaction = await this.transactionRepository.findOne({
        where: { id_transaction }
      });
      
      if (!transaction) {
        throw new NotFoundException('Transaction non trouvée');
      }
      
      if (transaction.statut !== TransactionStatus.EN_ATTENTE) {
        throw new BadRequestException(`La transaction est déjà ${transaction.statut}`);
      }
      
      // Récupérer les comptes
      const compteExpediteur = await this.getCompteById(transaction.id_compte_expediteur);
      const compteRecepteur = await this.getCompteById(transaction.id_compte_recepteur);
      
      if (!compteExpediteur || !compteRecepteur) {
        throw new NotFoundException('Un des comptes impliqués dans la transaction est introuvable');
      }
      
      // Vérifier le solde du compte expéditeur
      if (compteExpediteur.solde_compte < transaction.montant) {
        transaction.statut = TransactionStatus.ECHOUEE;
        await this.transactionRepository.save(transaction);
        throw new BadRequestException('Solde insuffisant');
      }
      
      // Calculer les montants
      const montantTotal = Number(transaction.montant); // Montant total saisi
      const frais = Number(transaction.frais_transaction);
      const montantDestinataire = montantTotal - frais; // Le destinataire reçoit le montant moins les frais
      
      // Mettre à jour les soldes des comptes
      compteExpediteur.solde_compte = Number(compteExpediteur.solde_compte) - montantTotal;
      compteRecepteur.solde_compte = Number(compteRecepteur.solde_compte) + montantDestinataire;
      
      // Mettre à jour les comptes
      await queryRunner.manager.save(compteExpediteur);
      await queryRunner.manager.save(compteRecepteur);
      
      // Mettre à jour le statut de la transaction
      transaction.statut = TransactionStatus.COMPLETEE;
      
      await queryRunner.manager.save(transaction);
      
      // Valider la transaction
      await queryRunner.commitTransaction();
      
      return transaction;
      
    } catch (error) {
      // En cas d'erreur, annuler tous les changements
      await queryRunner.rollbackTransaction();
      
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        `Erreur lors de l'exécution de la transaction: ${error.message}`
      );
    } finally {
      // Libérer les ressources
      await queryRunner.release();
    }
  }

  /**
   * Récupère un compte par son ID
   * Méthode utilitaire si getCompteById n'est pas disponible dans CompteService
   */
  private async getCompteById(id_compte: number): Promise<any> {
    // Si getCompteById n'existe pas dans votre CompteService, utilisez cette méthode
    try {
        // Faire directement une requête à la base de données
        return await this.dataSource.manager.findOne('compte', {
          where: { id_compte }
        });
      } catch (error) {
        console.error(`Erreur lors de la récupération du compte ${id_compte}:`, error);
        return null;
      }
    }

  /**
   * Récupère les transactions d'un utilisateur
   */
  async getUserTransactions(id_user: string): Promise<Transaction[]> {
    // Récupérer d'abord le compte de l'utilisateur
    const compte = await this.compteService.getUserCompte(id_user);
    
    if (!compte) {
      throw new NotFoundException('Compte utilisateur non trouvé');
    }
    
    // Récupérer toutes les transactions liées à ce compte
    return this.transactionRepository.find({
      where: [
        { id_compte_expediteur: compte.id_compte },
        { id_compte_recepteur: compte.id_compte }
      ],
      order: {
        date_transaction: 'DESC'
      }
    });
  }

  /**
   * Récupère une transaction par son ID
   */
  async getTransactionById(id_transaction: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id_transaction }
    });
    
    if (!transaction) {
      throw new NotFoundException('Transaction non trouvée');
    }
    
    return transaction;
  }

  /**
   * Annule une transaction si elle est toujours en attente
   */
  async cancelTransaction(id_transaction: number): Promise<Transaction> {
    const transaction = await this.getTransactionById(id_transaction);
    
    if (transaction.statut !== TransactionStatus.EN_ATTENTE) {
      throw new BadRequestException('Seules les transactions en attente peuvent être annulées');
    }
    
    transaction.statut = TransactionStatus.ANNULEE;
    return this.transactionRepository.save(transaction);
  }
}


