import { Repository, DataSource } from 'typeorm';
import { ModuleRef } from '@nestjs/core';
import { Transaction, TransactionStatus } from './entitie/transaction-interne.entity';
import { TransactionFrais } from 'src/transaction-frais/entite/transaction-frais.entity';
import { PayWithQrDto } from './payer-avec/payer-avec-qr.dto';
import { RollbackTransactionDto } from './rollback-dto/rollback-transaction.dto';
import { PayWithPhoneDto } from './payer-avec/payer-avec-telephone.dto';
import { PayWithEmailDto } from './payer-avec/payer-avec-email.dto';
import { NotificationService } from 'src/module_notification_push/notif_push.service';
export declare class TransactionInterneService {
    private readonly transactionRepository;
    private readonly transactionFraisRepository;
    private readonly dataSource;
    private readonly moduleRef;
    private readonly notificationService;
    constructor(transactionRepository: Repository<Transaction>, transactionFraisRepository: Repository<TransactionFrais>, dataSource: DataSource, moduleRef: ModuleRef, notificationService: NotificationService);
    private calculerFrais;
    getMyTransactions(userId: string): Promise<any[]>;
    getTransactionById(id: number): Promise<any>;
    private validateCriticalFields;
    createTransactionFromQrCode(userId: string, payWithQrDto: PayWithQrDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id_transaction: number;
            montant_total: number;
            frais: number;
            montant_recu: number;
            statut: TransactionStatus;
            date_transaction: Date;
        };
    }>;
    createTransactionFromPhone(userId: string, payWithPhoneDto: PayWithPhoneDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id_transaction: number;
            montant_total: number;
            frais: number;
            montant_recu: number;
            statut: TransactionStatus;
            date_transaction: Date;
        };
    }>;
    createTransactionFromEmail(userId: string, payWithEmailDto: PayWithEmailDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id_transaction: number;
            montant_total: number;
            frais: number;
            montant_recu: number;
            statut: TransactionStatus;
            date_transaction: Date;
        };
    }>;
    cancelTransaction(id: number, userId: string): Promise<Transaction>;
    rollbackTransaction(id: number, userId: string, rollbackDto: RollbackTransactionDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id_transaction_originale: number;
            id_transaction_remboursement: number;
            montant_rembourse: number;
            frais: number;
            statut: TransactionStatus;
            date_transaction: Date;
        };
    }>;
    private executeTransaction;
    private getQrCodeInfoFromToken;
    private getCompteByUserId;
    private getCompteById;
    getStats(): Promise<{
        montant_total_des_transactions: any;
        statistique_par_statut: any[];
        statistique_par_type: any[];
        montant_moyen_des_transactions: any;
        periodes: {
            statistique_par_jour: any;
            statistique_par_semaine: any;
            statistique_par_mois: any;
            statistique_par_an: any;
        };
        details: {
            jounalier: any[];
            mensuel: any[];
        };
    }>;
    getUserInfoFromQrCode(token: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id_user: string;
            nom: string | undefined;
            prenom: string | undefined;
            telephone: string | undefined;
            email: string | undefined;
            photo_profile: string | null;
        };
    }>;
}
