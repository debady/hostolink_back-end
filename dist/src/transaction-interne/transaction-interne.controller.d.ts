import { ModuleRef } from '@nestjs/core';
import { TransactionInterneService } from './transaction-interne.service';
import { PayWithQrDto } from './payer-avec/payer-avec-qr.dto';
import { PayWithPhoneDto } from './payer-avec/payer-avec-telephone.dto';
import { RollbackTransactionDto } from './rollback-dto/rollback-transaction.dto';
import { PayWithEmailDto } from './payer-avec/payer-avec-email.dto';
import { CreateTransactionDto } from './dto/transaction-interne.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto';
export declare class TransactionInterneController {
    private readonly TransactionInterneService;
    private readonly moduleRef;
    constructor(TransactionInterneService: TransactionInterneService, moduleRef: ModuleRef);
    getMyTransactions(req: any): Promise<any[]>;
    getTransactionStats(): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    getTransactionById(id: string, req: any): Promise<any>;
    payWithQr(req: any, payWithQrDto: PayWithQrDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id_transaction: number;
            montant_total: number;
            frais: number;
            montant_recu: number;
            statut: import("./entitie/transaction-interne.entity").TransactionStatus;
            date_transaction: Date;
        };
    }>;
    payWithPhone(req: any, payWithPhoneDto: PayWithPhoneDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id_transaction: number;
            montant_total: number;
            frais: number;
            montant_recu: number;
            statut: import("./entitie/transaction-interne.entity").TransactionStatus;
            date_transaction: Date;
        };
    }>;
    payWithEmail(req: any, payWithEmailDto: PayWithEmailDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id_transaction: number;
            montant_total: number;
            frais: number;
            montant_recu: number;
            statut: import("./entitie/transaction-interne.entity").TransactionStatus;
            date_transaction: Date;
        };
    }>;
    cancelTransaction(id: string, req: any): Promise<import("./entitie/transaction-interne.entity").Transaction>;
    rollbackTransaction(id: string, req: any, rollbackDto: RollbackTransactionDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id_transaction_originale: number;
            id_transaction_remboursement: number;
            montant_rembourse: number;
            frais: number;
            statut: import("./entitie/transaction-interne.entity").TransactionStatus;
            date_transaction: Date;
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
    create(createTransactionDto: CreateTransactionDto): Promise<import("./entitie/transaction-interne.entity").Transaction>;
    updateStatus(id: number, updateStatusDto: UpdateTransactionStatusDto): Promise<import("./entitie/transaction-interne.entity").Transaction>;
}
