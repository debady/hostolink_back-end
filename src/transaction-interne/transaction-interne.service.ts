// transaction.service.ts
import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ModuleRef } from '@nestjs/core';
import { Transaction, TransactionStatus, TransactionType } from './entitie/transaction-interne.entity';
import { ModePayment, TransactionFrais, TransactionFraisType } from 'src/transaction-frais/entite/transaction-frais.entity';
import { PayWithQrDto } from './payer-avec/payer-avec-qr.dto';
import { CreateTransactionDto } from './dto/transaction-interne.dto';
import { CreateTransactionFraisDto } from 'src/transaction-frais/dto/transaction-frais.dto';
import { RollbackTransactionDto } from './rollback-dto/rollback-transaction.dto';
import { PayWithPhoneDto } from './payer-avec/payer-avec-telephone.dto';
import { PayWithEmailDto } from './payer-avec/payer-avec-email.dto';

// Interface pour le compte
interface Compte {
  id_compte: number;
  solde_compte: number;
  devise: string;
}

// Interface pour QR Code
interface QrCodeInfo {
  id_qrcode: number;
  id_user?: string;
  id_user_etablissement_sante?: number;
  type: 'static' | 'dynamic';
}

@Injectable()
export class TransactionInterneService {

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionFrais)
    private readonly transactionFraisRepository: Repository<TransactionFrais>,
    private readonly dataSource: DataSource,
    private readonly moduleRef: ModuleRef
  ) {}


  // Récupérer toutes les transactions d'un utilisateur avec les noms des destinataires
async getMyTransactions(userId: string) {
  // Utilisation de createQueryBuilder pour joindre les tables et sélectionner les informations nécessaires
  return this.transactionRepository
    .createQueryBuilder('transaction')
    .leftJoinAndSelect(
      'utilisateur',
      'envoyeur',
      'transaction.id_utilisateur_envoyeur = envoyeur.id_user'
    )
    .leftJoinAndSelect(
      'utilisateur',
      'recepteur',
      'transaction.id_utilisateur_recepteur = recepteur.id_user'
    )
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

// Récupérer une transaction par ID avec les noms des destinataires
async getTransactionById(id: number) {
  const transaction = await this.transactionRepository
    .createQueryBuilder('transaction')
    .leftJoinAndSelect(
      'utilisateur',
      'envoyeur',
      'transaction.id_utilisateur_envoyeur = envoyeur.id_user'
    )
    .leftJoinAndSelect(
      'utilisateur',
      'recepteur',
      'transaction.id_utilisateur_recepteur = recepteur.id_user'
    )
    .select([
      'transaction.*',
      'recepteur.nom as nom_recepteur',
      'recepteur.prenom as prenom_recepteur'
    ])
    .where('transaction.id_transaction = :id', { id })
    .getRawOne();

  if (!transaction) {
    throw new NotFoundException(`Transaction avec ID ${id} non trouvée`);
  }

  return transaction;
}





  // Créer une transaction à partir d'un QR code scanné
  async createTransactionFromQrCode(userId: string, payWithQrDto: PayWithQrDto) {
    const { token, montant_envoyer } = payWithQrDto;

    // Trouver le QR code correspondant au token
    const qrCodeInfo = await this.getQrCodeInfoFromToken(token);
    if (!qrCodeInfo) {
      throw new NotFoundException(`QR code avec token ${token} non trouvé`);
    }

   // Déterminer le type de QR code (statique ou dynamique)
    let isStatic = false;
    let isQrcodeDynamic = false;
    let idQrcode: number | null = null;
    let recipientId: string | number | null = null;

    if (qrCodeInfo.type === 'static') {
      isStatic = true;
      idQrcode = qrCodeInfo.id_qrcode;
      
      // Vérification explicite du type du destinataire
      if (qrCodeInfo.id_user) {
        recipientId = qrCodeInfo.id_user; // string (UUID)
      } else if (qrCodeInfo.id_user_etablissement_sante) {
        recipientId = qrCodeInfo.id_user_etablissement_sante; // number
      }
    } else {
      isQrcodeDynamic = true;
      idQrcode = qrCodeInfo.id_qrcode;
      
      // Même vérification pour le QR code dynamique
      if (qrCodeInfo.id_user) {
        recipientId = qrCodeInfo.id_user;
      } else if (qrCodeInfo.id_user_etablissement_sante) {
        recipientId = qrCodeInfo.id_user_etablissement_sante;
      }
    }

    // Vérifier que l'utilisateur ne paie pas lui-même
    if (recipientId === userId) {
      throw new BadRequestException('Vous ne pouvez pas effectuer un paiement à vous-même');
    }

    // Récupérer les informations du compte de l'expéditeur
    const compteExpéditeur = await this.getCompteByUserId(userId);
    if (!compteExpéditeur) {
      throw new NotFoundException('Compte de l\'expéditeur non trouvé');
    }

    // Récupérer les informations du compte du destinataire
    let compteRecepteur: Compte | null;
    let id_utilisateur_recepteur: string | undefined;
    let id_etablissement_recepteur: number | undefined;
    let id_etablissement_envoyeur: number | undefined;
    let typeTransaction = TransactionType.PAIEMENT;

    if (qrCodeInfo.id_user) {
      // Destinataire est un utilisateur
      compteRecepteur = await this.getCompteByUserId(qrCodeInfo.id_user);
      id_utilisateur_recepteur = qrCodeInfo.id_user;
    } else if (qrCodeInfo.id_user_etablissement_sante) {
      // Destinataire est un établissement
      /* COMMENTÉ: Module des établissements de santé non encore développé
      compteRecepteur = await this.getCompteByEtablissementId(qrCodeInfo.id_user_etablissement_sante);
      id_etablissement_recepteur = qrCodeInfo.id_user_etablissement_sante;
      */
      throw new BadRequestException('Les paiements aux établissements de santé ne sont pas encore disponibles');
    } else {
      throw new NotFoundException('Destinataire invalide dans le QR code');
    }

    if (!compteRecepteur) {
      throw new NotFoundException('Compte du bénéficiaire non trouvé');
    }

    // Calculer les frais (0.5% du montant)
    const frais = montant_envoyer * 0.005;
    const montantRecu = montant_envoyer - frais;

    // Commencer une transaction de base de données
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Créer la transaction
      const transactionData: CreateTransactionDto = {
        id_compte_expediteur: compteExpéditeur.id_compte,
        id_utilisateur_envoyeur: userId,
        id_utilisateur_recepteur,
        id_etablissement_recepteur,
        id_etablissement_envoyeur,
        montant_envoyer: montant_envoyer,
        montant_reçu: montantRecu,
        frais_preleve: frais,
        statut: TransactionStatus.EN_ATTENTE,
        devise_transaction: compteExpéditeur.devise,
        type_transaction: typeTransaction,
        id_compte_recepteur: compteRecepteur.id_compte,
      };

      // Ajouter l'ID du QR code approprié
      if (isStatic) {
        transactionData.id_qrcode_statique = idQrcode;
      } else if (isQrcodeDynamic) {
        transactionData.id_qrcode_dynamique = idQrcode;
      }



      // Créer et sauvegarder la transaction
      const newTransaction = this.transactionRepository.create(transactionData);
      const savedTransaction = await queryRunner.manager.save(newTransaction);



      // Créer l'entrée dans la table transactions_frais
      const transactionFraisData: CreateTransactionFraisDto = {
        id_transaction: savedTransaction.id_transaction,
        montant_frais: frais,
        type_transaction: TransactionFraisType.INTERNE,
        mode_paiement: ModePayment.WALLET,
      };

      const newTransactionFrais = this.transactionFraisRepository.create(transactionFraisData);
      await queryRunner.manager.save(newTransactionFrais);




      // Exécuter la transaction (débiter/créditer les comptes)
      await this.executeTransaction(
        queryRunner,
        compteExpéditeur.id_compte,
        compteRecepteur.id_compte,
        montant_envoyer,
        montantRecu,
        savedTransaction.id_transaction
      );

      // Commit de la transaction
      await queryRunner.commitTransaction();

      

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
    } catch (error) {
      // Rollback en cas d'erreur
      await queryRunner.rollbackTransaction();
      
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      throw new InternalServerErrorException(`Erreur lors de la transaction: ${error.message}`);
    } finally {
      // Libérer le queryRunner
      await queryRunner.release();
    }
  }
  







// Créer une transaction à partir d'un numéro de téléphone
async createTransactionFromPhone(userId: string, payWithPhoneDto: PayWithPhoneDto) {
  const { telephone, montant_envoyer, description } = payWithPhoneDto;

  let destinationUser: any = null;
  let etablissementSante: any = null;

  // Rechercher d'abord si c'est un utilisateur
  try {
    destinationUser = await this.dataSource.manager.findOne('utilisateur', {
      where: { 
        telephone,
        actif: true 
      }
    });
  } catch (error) {
    console.error("Erreur lors de la recherche d'utilisateur:", error);
  }

  /* COMMENTÉ: Module des établissements de santé non encore développé
  // Si aucun utilisateur trouvé, chercher dans les établissements
  if (!destinationUser) {
    try {
      etablissementSante = await this.dataSource.manager.findOne('etablissement_sante', {
        where: { 
          telephone,
          actif: true 
        }
      });
    } catch (error) {
      console.error("Erreur lors de la recherche d'établissement:", error);
    }
  }
  */

  // Si ni utilisateur ni établissement n'est trouvé
  if (!destinationUser /* && !etablissementSante */) {
    throw new NotFoundException(`Aucun utilisateur trouvé avec le numéro ${telephone}`);
  }

  // Vérifier que l'utilisateur ne paie pas lui-même
  if (destinationUser && destinationUser.id_user === userId) {
    throw new BadRequestException('Vous ne pouvez pas effectuer un paiement à vous-même');
  }

  /* COMMENTÉ: Module des établissements de santé non encore développé
  // Vérification similaire pour les établissements si nécessaire
  if (etablissementSante && etablissementSante.id_user_proprietaire === userId) {
    throw new BadRequestException('Vous ne pouvez pas effectuer un paiement à votre propre établissement');
  }
  */

  // Récupérer les informations du compte de l'expéditeur
  const compteExpéditeur = await this.getCompteByUserId(userId);
  if (!compteExpéditeur) {
    throw new NotFoundException('Compte de l\'expéditeur non trouvé');
  }

  // Récupérer les informations du compte du destinataire
  let compteRecepteur: Compte | null;
  let id_utilisateur_recepteur: string | undefined;
  let id_etablissement_recepteur: number | undefined;
  let id_etablissement_envoyeur: number | undefined;
  let typeTransaction = TransactionType.TRANSFERT;

  if (destinationUser) {
    // Destinataire est un utilisateur
    compteRecepteur = await this.getCompteByUserId(destinationUser.id_user);
    id_utilisateur_recepteur = destinationUser.id_user;
  } 
  /* COMMENTÉ: Module des établissements de santé non encore développé
  else if (etablissementSante) {
    // Destinataire est un établissement
    compteRecepteur = await this.getCompteByEtablissementId(etablissementSante.id_etablissement);
    id_etablissement_recepteur = etablissementSante.id_etablissement;
  } 
  */
  else {
    throw new NotFoundException('Aucun destinataire trouvé avec ce numéro');
  }

  if (!compteRecepteur) {
    throw new NotFoundException('Compte du bénéficiaire non trouvé');
  }

  // Calculer les frais (0.5% du montant)
  const frais = montant_envoyer * 0.005;
  const montantRecu = montant_envoyer - frais;

  // Commencer une transaction de base de données
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Créer la transaction
    const transactionData: CreateTransactionDto = {
      id_compte_expediteur: compteExpéditeur.id_compte,
      id_utilisateur_envoyeur: userId,
      id_utilisateur_recepteur,
      id_etablissement_recepteur,
      id_etablissement_envoyeur,
      montant_envoyer: montant_envoyer,
      montant_reçu: montantRecu,
      frais_preleve: frais,
      statut: TransactionStatus.EN_ATTENTE,
      devise_transaction: compteExpéditeur.devise,
      type_transaction: typeTransaction,
      id_compte_recepteur: compteRecepteur.id_compte,
    };

    // Créer et sauvegarder la transaction
    const newTransaction = this.transactionRepository.create(transactionData);
    const savedTransaction = await queryRunner.manager.save(newTransaction);

    // Créer l'entrée dans la table transactions_frais
    const transactionFraisData: CreateTransactionFraisDto = {
      id_transaction: savedTransaction.id_transaction,
      montant_frais: frais,
      type_transaction: TransactionFraisType.INTERNE,
      mode_paiement: ModePayment.WALLET,
    };

    const newTransactionFrais = this.transactionFraisRepository.create(transactionFraisData);
    await queryRunner.manager.save(newTransactionFrais);

    // Exécuter la transaction (débiter/créditer les comptes)
    await this.executeTransaction(
      queryRunner,
      compteExpéditeur.id_compte,
      compteRecepteur.id_compte,
      montant_envoyer,
      montantRecu,
      savedTransaction.id_transaction
    );


     // Obtenir les informations du destinataire pour l'affichage
      let nomDestinataire = '';
      if (destinationUser) {
        nomDestinataire = `${destinationUser.prenom || ''} ${destinationUser.nom || ''}`.trim();
      }
      /* COMMENTÉ: Module des établissements de santé non encore développé
      else if (etablissementSante) {
        nomDestinataire = etablissementSante.nom_etablissement || '';
      }
      */



    // Commit de la transaction
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
  } catch (error) {
    // Rollback en cas d'erreur
    await queryRunner.rollbackTransaction();
    
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }
    
    throw new InternalServerErrorException(`Erreur lors de la transaction: ${error.message}`);
  } finally {
    // Libérer le queryRunner
    await queryRunner.release();
  }
}






// Créer une transaction à partir d'une adresse email

async createTransactionFromEmail(userId: string, payWithEmailDto: PayWithEmailDto) {
  const { email, montant_envoyer, description } = payWithEmailDto;

  let destinationUser: any = null;
  let etablissementSante: any = null;

  // Rechercher d'abord si c'est un utilisateur
  try {
    destinationUser = await this.dataSource.manager.findOne('utilisateur', {
      where: { 
        email,
        actif: true 
      }
    });
  } catch (error) {
    console.error("Erreur lors de la recherche d'utilisateur par email:", error);
  }

  /* COMMENTÉ: Module des établissements de santé non encore développé
  // Si aucun utilisateur trouvé, chercher dans les établissements
  if (!destinationUser) {
    try {
      etablissementSante = await this.dataSource.manager.findOne('etablissement_sante', {
        where: { 
          email,
          actif: true 
        }
      });
    } catch (error) {
      console.error("Erreur lors de la recherche d'établissement par email:", error);
    }
  }
  */

  // Si ni utilisateur ni établissement n'est trouvé
  if (!destinationUser /* && !etablissementSante */) {
    throw new NotFoundException(`Aucun utilisateur trouvé avec l'email ${email}`);
  }

  // Vérifier que l'utilisateur ne paie pas lui-même
  if (destinationUser && destinationUser.id_user === userId) {
    throw new BadRequestException('Vous ne pouvez pas effectuer un paiement à vous-même');
  }

  /* COMMENTÉ: Module des établissements de santé non encore développé
  // Vérification similaire pour les établissements si nécessaire
  if (etablissementSante && etablissementSante.id_user_proprietaire === userId) {
    throw new BadRequestException('Vous ne pouvez pas effectuer un paiement à votre propre établissement');
  }
  */

  // Récupérer les informations du compte de l'expéditeur
  const compteExpéditeur = await this.getCompteByUserId(userId);
  if (!compteExpéditeur) {
    throw new NotFoundException('Compte de l\'expéditeur non trouvé');
  }

  // Récupérer les informations du compte du destinataire
  let compteRecepteur: Compte | null;
  let id_utilisateur_recepteur: string | undefined;
  let id_etablissement_recepteur: number | undefined;
  let id_etablissement_envoyeur: number | undefined;
  let typeTransaction = TransactionType.TRANSFERT;

  if (destinationUser) {
    // Destinataire est un utilisateur
    compteRecepteur = await this.getCompteByUserId(destinationUser.id_user);
    id_utilisateur_recepteur = destinationUser.id_user;
  } 
  /* COMMENTÉ: Module des établissements de santé non encore développé
  else if (etablissementSante) {
    // Destinataire est un établissement
    compteRecepteur = await this.getCompteByEtablissementId(etablissementSante.id_etablissement);
    id_etablissement_recepteur = etablissementSante.id_etablissement;
  } 
  */
  else {
    throw new NotFoundException('Aucun destinataire trouvé avec cet email');
  }

  if (!compteRecepteur) {
    throw new NotFoundException('Compte du bénéficiaire non trouvé');
  }

  // Calculer les frais (0.5% du montant)
  const frais = montant_envoyer * 0.005;
  const montantRecu = montant_envoyer - frais;

  // Commencer une transaction de base de données
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Créer la transaction
    const transactionData: CreateTransactionDto = {
      id_compte_expediteur: compteExpéditeur.id_compte,
      id_utilisateur_envoyeur: userId,
      id_utilisateur_recepteur,
      id_etablissement_recepteur,
      id_etablissement_envoyeur,
      montant_envoyer: montant_envoyer,
      montant_reçu: montantRecu,
      frais_preleve: frais,
      statut: TransactionStatus.EN_ATTENTE,
      devise_transaction: compteExpéditeur.devise,
      type_transaction: typeTransaction,
      id_compte_recepteur: compteRecepteur.id_compte,
      // description: description || null
    };

    // Créer et sauvegarder la transaction
    const newTransaction = this.transactionRepository.create(transactionData);
    const savedTransaction = await queryRunner.manager.save(newTransaction);

    // Créer l'entrée dans la table transactions_frais
    const transactionFraisData: CreateTransactionFraisDto = {
      id_transaction: savedTransaction.id_transaction,
      montant_frais: frais,
      type_transaction: TransactionFraisType.INTERNE,
      mode_paiement: ModePayment.WALLET,
    };

    const newTransactionFrais = this.transactionFraisRepository.create(transactionFraisData);
    await queryRunner.manager.save(newTransactionFrais);

    // Exécuter la transaction (débiter/créditer les comptes)
    await this.executeTransaction(
      queryRunner,
      compteExpéditeur.id_compte,
      compteRecepteur.id_compte,
      montant_envoyer,
      montantRecu,
      savedTransaction.id_transaction
    );

    // Obtenir les informations du destinataire pour l'affichage
    let nomDestinataire = '';
    if (destinationUser) {
      nomDestinataire = `${destinationUser.prenom || ''} ${destinationUser.nom || ''}`.trim();
    }
    /* COMMENTÉ: Module des établissements de santé non encore développé
    else if (etablissementSante) {
      nomDestinataire = etablissementSante.nom_etablissement || '';
    }
    */

    // Commit de la transaction
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
  } catch (error) {
    // Rollback en cas d'erreur
    await queryRunner.rollbackTransaction();
    
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }
    
    throw new InternalServerErrorException(`Erreur lors de la transaction: ${error.message}`);
  } finally {
    // Libérer le queryRunner
    await queryRunner.release();
  }
}









  // Annuler une transaction (uniquement si elle est encore en attente)
  async cancelTransaction(id: number, userId: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id_transaction: id }
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction avec ID ${id} non trouvée`);
    }

    if (transaction.id_utilisateur_envoyeur !== userId) {
      throw new BadRequestException('Vous ne pouvez annuler que vos propres transactions');
    }

    if (transaction.statut !== TransactionStatus.EN_ATTENTE) {
      throw new BadRequestException('Seules les transactions en attente peuvent être annulées');
    }

    transaction.statut = TransactionStatus.ANNULEE;
    return this.transactionRepository.save(transaction);
  }





// Rollback d'une transaction complétée (créer une transaction inverse)
async rollbackTransaction(id: number, userId: string, rollbackDto: RollbackTransactionDto) {
  // Récupérer la transaction originale
  const originalTransaction = await this.transactionRepository.findOne({
    where: { id_transaction: id }
  });

  if (!originalTransaction) {
    throw new NotFoundException(`Transaction avec ID ${id} non trouvée`);
  }

  // Vérifier que la transaction est complétée
  if (originalTransaction.statut !== TransactionStatus.REUSSIE) {
    throw new BadRequestException('Seules les transactions réussies peuvent être remboursées');
  }

  // Créer une transaction de rollback (inverse de l'originale)
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Récupérer les comptes impliqués
    const compteOriginalRecepteur = await this.getCompteById(originalTransaction.id_compte_recepteur);
    const compteOriginalExpediteur = await this.getCompteById(originalTransaction.id_compte_expediteur);

    if (!compteOriginalRecepteur || !compteOriginalExpediteur) {
      throw new NotFoundException('Un des comptes impliqués dans la transaction n\'existe plus');
    }

    // Vérifier que le destinataire original a suffisamment de fonds pour le remboursement
    if (compteOriginalRecepteur.solde_compte < originalTransaction.montant_reçu) {
      throw new BadRequestException('Le bénéficiaire n\'a pas assez de fonds pour effectuer le remboursement');
    }

    // Le montant à rembourser est exactement le montant que le destinataire a reçu
    const montantADebiter = originalTransaction.montant_reçu;
    const montantACrediter = originalTransaction.montant_reçu; // Pas de frais supplémentaires

    // Créer la transaction de remboursement
    const remboursementData: CreateTransactionDto = {
      id_compte_expediteur: originalTransaction.id_compte_recepteur, // Compte du destinataire original
      id_utilisateur_envoyeur: originalTransaction.id_utilisateur_recepteur as string,
      id_utilisateur_recepteur: originalTransaction.id_utilisateur_envoyeur as string,
      id_etablissement_recepteur: originalTransaction.id_etablissement_envoyeur,
      id_etablissement_envoyeur: originalTransaction.id_etablissement_recepteur,
      montant_envoyer: montantADebiter, // Montant débité du destinataire original
      montant_reçu: montantACrediter, // Même montant crédité à l'expéditeur original
      frais_preleve: 0, // Pas de frais pour le remboursement
      statut: TransactionStatus.EN_ATTENTE,
      devise_transaction: originalTransaction.devise_transaction,
      type_transaction: TransactionType.REMBOURSEMENT,
      id_compte_recepteur: originalTransaction.id_compte_expediteur
    };

    // Créer et sauvegarder la transaction de remboursement
    const newRollbackTransaction = this.transactionRepository.create(remboursementData);
    const savedRollbackTransaction = await queryRunner.manager.save(newRollbackTransaction);

    // Exécuter la transaction de remboursement
    await this.executeTransaction(
      queryRunner,
      originalTransaction.id_compte_recepteur, // Compte du destinataire original
      originalTransaction.id_compte_expediteur, // Compte de l'expéditeur original
      montantADebiter, // Montant débité du compte du destinataire original
      montantACrediter, // Montant crédité au compte de l'expéditeur original
      savedRollbackTransaction.id_transaction
    );

    // Mettre à jour le motif du remboursement si fourni
    if (rollbackDto.motif) {
      await queryRunner.manager.update(
        'transaction_interne',
        { id_transaction: savedRollbackTransaction.id_transaction },
        { motif_annulation: `Remboursement administratif de transaction ID: ${id}: ${rollbackDto.motif}` }
      );
    }

    // Ajouter une référence à la transaction originale
    try {
      await queryRunner.manager.update(
        'transaction_interne',
        { id_transaction: savedRollbackTransaction.id_transaction },
        { transaction_liee: id }
      );
    } catch (error) {
      console.warn('Impossible de définir transaction_liee, le champ n\'existe peut-être pas:', error.message);
    }

    // Commit de la transaction
    await queryRunner.commitTransaction();

    return {
      success: true,
      message: 'Remboursement administratif effectué avec succès',
      data: {
        id_transaction_originale: id,
        id_transaction_remboursement: savedRollbackTransaction.id_transaction,
        montant_rembourse: montantACrediter,
        frais: 0, // Pas de frais pour le remboursement
        statut: savedRollbackTransaction.statut,
        date_transaction: savedRollbackTransaction.date_transaction
      }
    };
  } catch (error) {
    // Rollback en cas d'erreur
    await queryRunner.rollbackTransaction();
    
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }
    
    throw new InternalServerErrorException(`Erreur lors du remboursement: ${error.message}`);
  } finally {
    // Libérer le queryRunner
    await queryRunner.release();
  }
}




  // Exécuter une transaction (mise à jour des comptes)
  private async executeTransaction(
    queryRunner: any,
    id_compte_expediteur: number,
    id_compte_recepteur: number,
    montant_total: number,
    montant_recu: number,
    id_transaction: number
  ) {
    // Vérifier si l'expéditeur a des fonds suffisants
    const compteExpéditeur = await queryRunner.manager.findOne('compte', {
      where: { id_compte: id_compte_expediteur }
    });

    if (!compteExpéditeur || compteExpéditeur.solde_compte < montant_total) {
      throw new BadRequestException('Solde insuffisant pour effectuer cette transaction');
    }

    // Débiter le compte de l'expéditeur
    await queryRunner.manager.decrement(
      'compte',
      { id_compte: id_compte_expediteur },
      'solde_compte',
      montant_total
    );

    // Créditer le compte du destinataire
    await queryRunner.manager.increment(
      'compte',
      { id_compte: id_compte_recepteur },
      'solde_compte',
      montant_recu
    );

    // Mettre à jour le statut de la transaction
    await queryRunner.manager.update(
      'transaction_interne',
      { id_transaction: id_transaction },
      { statut: TransactionStatus.REUSSIE }
    );
  }

  // Méthodes utilitaires pour récupérer les informations
  private async getQrCodeInfoFromToken(token: string): Promise<QrCodeInfo | null> {
    try {
      // Essayer d'abord de chercher dans la table QR code dynamique
      const qrCodeDynamique = await this.dataSource.manager.findOne('qr_code_paiement_dynamique', {
        where: { token }
      }) as any; // Utiliser 'as any' pour éviter les erreurs TypeScript
      
      if (qrCodeDynamique) {
        return {
          id_qrcode: qrCodeDynamique.id_qrcode,
          id_user: qrCodeDynamique.id_user,
          id_user_etablissement_sante: qrCodeDynamique.id_user_etablissement_sante,
          type: 'dynamic'
        };
      }
      
      // Sinon, chercher dans la table QR code statique
      const qrCodeStatique = await this.dataSource.manager.findOne('qr_code_paiement_statique', {
        where: { token }
      }) as any; // Utiliser 'as any' pour éviter les erreurs TypeScript
      
      if (qrCodeStatique) {
        return {
          id_qrcode: qrCodeStatique.id_qrcode,
          id_user: qrCodeStatique.id_user,
          id_user_etablissement_sante: qrCodeStatique.id_user_etablissement_sante,
          type: 'static'
        };
      }
      
      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération du QR code:", error);
      return null;
    }
  }

  private async getCompteByUserId(userId: string): Promise<Compte | null> {
    try {
      const compte = await this.dataSource.manager.findOne('compte', {
        where: { id_user: userId }
      }) as Compte | null;
      
      return compte;
    } catch (error) {
      console.error(`Erreur lors de la récupération du compte pour l'utilisateur ${userId}:`, error);
      return null;
    }
  }

  // COMMENTÉ: Module des établissements de santé non encore développé
  private async getCompteByEtablissementId(etablissementId: number): Promise<Compte | null> {
    try {
      const compte = await this.dataSource.manager.findOne('compte', {
        where: { id_user_etablissement_sante: etablissementId }
      }) as Compte | null;
      
      return compte;
    } catch (error) {
      console.error(`Erreur lors de la récupération du compte pour l'établissement ${etablissementId}:`, error);
      return null;
    }
  }

  private async getCompteById(id_compte: number): Promise<Compte | null> {
    try {
      const compte = await this.dataSource.manager.findOne('compte', {
        where: { id_compte }
      }) as Compte | null;
      
      return compte;
    } catch (error) {
      console.error(`Erreur lors de la récupération du compte ${id_compte}:`, error);
      return null;
    }
  }
}