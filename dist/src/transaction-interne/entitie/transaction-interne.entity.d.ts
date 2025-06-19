export declare enum TransactionStatus {
    EN_ATTENTE = "en attente",
    REUSSIE = "r\u00E9ussie",
    ECHOUEE = "\u00E9chou\u00E9e",
    ANNULEE = "annul\u00E9e",
    REMBOURSEE = "rembours\u00E9e"
}
export declare enum TransactionType {
    TRANSFERT = "transfert",
    PAIEMENT = "paiement",
    REMBOURSEMENT = "remboursement",
    RECHARGE = "recharge"
}
export declare class Transaction {
    id_transaction: number;
    id_compte_expediteur: number;
    id_utilisateur_envoyeur: string | null;
    id_utilisateur_recepteur: string | null;
    id_etablissement_recepteur: number;
    id_etablissement_envoyeur: number;
    montant_envoyer: number;
    montant_recu: number;
    frais_preleve: number;
    statut: TransactionStatus;
    devise_transaction: string;
    motif_annulation: string;
    type_transaction: TransactionType;
    date_transaction: Date;
    id_qrcode_dynamique: number;
    id_qrcode_statique: number;
    id_compte_recepteur: number;
}
