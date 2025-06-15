import { Repository } from 'typeorm';
import { TransactionFrais } from './entite/transaction-frais.entity';
export declare class TransactionFraisService {
    private transactionFraisRepository;
    constructor(transactionFraisRepository: Repository<TransactionFrais>);
    findAll(page: number, limit: number): Promise<{
        transactions: TransactionFrais[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    findOne(id: number): Promise<TransactionFrais>;
    findByUser(id_user: string, page: number, limit: number): Promise<{
        transactions: TransactionFrais[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            pages: number;
        };
    }>;
    getStats(): Promise<{
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
    }>;
    getUserStats(id_user: string): Promise<{
        total: any;
        byType: any[];
        byMode: any[];
    }>;
}
