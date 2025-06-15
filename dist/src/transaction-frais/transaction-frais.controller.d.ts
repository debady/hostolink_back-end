import { TransactionFraisService } from './transaction-frais.service';
export declare class TransactionFraisController {
    private readonly transactionFraisService;
    constructor(transactionFraisService: TransactionFraisService);
    getAllTransactionFrais(page?: number, limit?: number): Promise<{
        success: boolean;
        message: string;
        data: {
            transactions: import("./entite/transaction-frais.entity").TransactionFrais[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                pages: number;
            };
        };
    }>;
    getUserTransactionFrais(id_user: string, page?: number, limit?: number): Promise<{
        success: boolean;
        message: string;
        data: {
            transactions: import("./entite/transaction-frais.entity").TransactionFrais[];
            pagination: {
                total: number;
                page: number;
                limit: number;
                pages: number;
            };
        };
    }>;
    getTransactionFraisStats(): Promise<{
        success: boolean;
        message: string;
        data: {
            somme_totale_des_frais: any;
            stat_par_type_transaction: any[];
            stat_par_mode_de_paiement: any[];
            stats_par_periode: {
                statistique_journalière: any;
                statistique_hebdomadaire: any;
                statistique_mensuelle: any;
                statistique_annuelle: any;
            };
            details: {
                journalière: any[];
                mensuelle: any[];
            };
        };
    }>;
    getUserTransactionFraisStats(id_user: string): Promise<{
        success: boolean;
        message: string;
        data: {
            total: any;
            byType: any[];
            byMode: any[];
        };
    }>;
    getTransactionFraisById(id: number): Promise<{
        success: boolean;
        message: string;
        data: import("./entite/transaction-frais.entity").TransactionFrais;
    }>;
}
