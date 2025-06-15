import { TransactionStatus, TransactionType } from '../entitie/transaction-interne.entity';
export declare class CreateTransactionDto {
    id_compte_expediteur: number;
    id_utilisateur_envoyeur?: string;
    id_utilisateur_recepteur?: string;
    id_etablissement_recepteur?: number;
    id_etablissement_envoyeur?: number;
    montant_envoyer: number;
    montant_recu: number;
    frais_preleve?: number;
    motif_annulation?: string;
    statut?: TransactionStatus;
    devise_transaction?: string;
    type_transaction?: TransactionType;
    id_qrcode_dynamique?: number;
    id_qrcode_statique?: number;
    id_compte_recepteur: number;
}
