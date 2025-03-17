import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { CompteService } from '../compte/compte.service';
import { QrCodeService } from '../qr-code/qr-code.service';
import { TransactionInterne } from './entitie/transaction_interne.entity';
import { TransactionFrais } from 'src/transaction_frais/entitie/transaction_frais.entity';
import { NotificationService } from 'src/notification_transaction/notification_transaction.service';
import { RecipientType } from 'src/qr-code/interface_qr_code/qr-code-payload.interface';

@Injectable()
export class TransactionService {
  getFraisByTransaction(idTransaction: number) {
    throw new Error('Method not implemented.');
  }
  private readonly FEE_PERCENTAGE = 0.5; // 0.5% de frais de transaction

  constructor(
    @InjectRepository(TransactionInterne)
    private transactionRepository: Repository<TransactionInterne>,
    @InjectRepository(TransactionFrais)
    private fraisRepository: Repository<TransactionFrais>,
    private compteService: CompteService,
    private qrCodeService: QrCodeService,
    private notificationService: NotificationService,
    private connection: Connection,
  ) {}

  async processTransaction(expediteurCompteId: number, qrCodeToken: string, montant: number) {
    // Vérifier le montant
    if (montant <= 0) {
      throw new BadRequestException('Le montant doit être supérieur à zéro');
    }

    // Vérifier et décoder le QR code
    const qrCodeResult = await this.qrCodeService.validateQrCode(qrCodeToken);
    
    if (!qrCodeResult.isValid || !qrCodeResult.payload) {
      throw new BadRequestException('QR code invalide ou expiré');
    }

    const payload = qrCodeResult.payload;

    // Obtenir le compte de l'expéditeur
    const compteExpediteur = await this.compteService.findCompteById(expediteurCompteId);
    
    // Vérifier le solde
    if (compteExpediteur.solde_compte < montant) {
      throw new BadRequestException('Solde insuffisant');
    }

    // Trouver le compte du destinataire
    let compteRecepteur;
    let etablissementId: number | null = null;
    let userId = null;
    let isEstablishment = false;
    let recipientId: number | string | null = null;
    
    if (payload.recipientType === RecipientType.ETABLISSEMENT) {
      etablissementId = payload.recipientId as number;
      recipientId = etablissementId;
      isEstablishment = true;
      compteRecepteur = await this.compteService.findCompteByEtablissement(etablissementId);
    } else {
      // Pour l'instant nous n'avons pas implémenté l'utilisateur
      throw new BadRequestException('Type de destinataire non pris en charge');
    }

    // Calculer les frais
    const fraisMontant = (montant * this.FEE_PERCENTAGE) / 100;
    const montantNet = montant - fraisMontant;

    // Utiliser une transaction de base de données
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Créer l'enregistrement des frais
      const frais = this.fraisRepository.create({
        montant_frais: fraisMontant,
        mode_paiement: 'wallet',
      });
      
      // On ne peut pas encore remplir id_transaction car il n'est pas encore créé
      const savedFrais = await queryRunner.manager.save(frais);

      // 2. Créer la transaction
      const transaction = this.transactionRepository.create({
        id_compte_expediteur: expediteurCompteId,
        id_compte_recepteur: compteRecepteur.id_compte,
        montant: montant,
        frais_transaction: fraisMontant,
        devise_transaction: compteExpediteur.devise,
        type_transaction: 'paiement_qrcode',
        statut: 'termine',
        id_transaction: savedFrais.id_frais, // Association avec les frais
      });

      if (etablissementId) {
        transaction.id_etablissement_recepteur = etablissementId;
        transaction.id_user_etablissement_sante = etablissementId;
      }

      const savedTransaction = await queryRunner.manager.save(transaction);

      // 3. Mettre à jour les frais avec l'ID de transaction
      savedFrais.id_transaction = savedTransaction.id_transaction;
      await queryRunner.manager.save(savedFrais);

      // 4. Mettre à jour les soldes des comptes
      compteExpediteur.solde_compte -= montant;
      compteRecepteur.solde_compte += montantNet;

      await queryRunner.manager.save(compteExpediteur);
      await queryRunner.manager.save(compteRecepteur);

      // Valider la transaction
      await queryRunner.commitTransaction();

      // 5. Créer les notifications (après la transaction réussie)
      await this.notificationService.createTransactionNotifications(
        savedTransaction.id_transaction,
        montant,
        montantNet,
        expediteurCompteId,
        { 
          isEstablishment, 
          id: recipientId as unknown as string | number // Utilisez une assertion de type ici
        }
      );

      return {
        success: true,
        transactionId: savedTransaction.id_transaction,
        montant: montant,
        frais: fraisMontant,
        montantNet: montantNet,
        dateTransaction: savedTransaction.date_transaction
      };
    } catch (error) {
      // Annuler en cas d'erreur
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Libérer les ressources
      await queryRunner.release();
    }
  }

  async getTransactionById(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id_transaction: id },
      relations: ['compteExpediteur', 'compteRecepteur', 'frais']
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction #${id} non trouvée`);
    }

    return transaction;
  }
}