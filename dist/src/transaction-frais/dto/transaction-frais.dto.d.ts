import { ModePayment, TransactionFraisType } from '../entite/transaction-frais.entity';
export declare class CreateTransactionFraisDto {
    id_transaction: number;
    montant_frais: number;
    type_transaction: TransactionFraisType;
    mode_paiement: ModePayment;
}
