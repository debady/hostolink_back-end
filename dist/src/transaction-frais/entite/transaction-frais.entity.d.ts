export declare enum TransactionFraisType {
    INTERNE = "interne",
    EXTERNE = "externe",
    BANCAIRE = "bancaire"
}
export declare enum ModePayment {
    WALLET = "wallet",
    MOBILE_MONEY = "mobile_money",
    BANQUE = "banque"
}
export declare class TransactionFrais {
    id_frais: number;
    id_transaction: number;
    montant_frais: number;
    type_transaction: TransactionFraisType;
    mode_paiement: ModePayment;
    date_creation: Date;
}
