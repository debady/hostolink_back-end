export declare enum RecipientType {
    USER = "user",
    ETABLISSEMENT = "etablissement"
}
export declare enum QrCodeType {
    STATIC = "static",
    DYNAMIC = "dynamic"
}
export interface QrCodePayloadUser {
    recipientType: RecipientType.USER;
    recipientId: string;
    accountNumber?: string;
    currency?: string;
    qrType: QrCodeType;
    timestamp: number;
    expiresAt?: number;
}
export interface QrCodePayloadEtablissement {
    recipientType: RecipientType.ETABLISSEMENT;
    recipientId: number;
    accountNumber?: string;
    currency?: string;
    qrType: QrCodeType;
    timestamp: number;
    expiresAt?: number;
}
export type QrCodePayload = QrCodePayloadUser | QrCodePayloadEtablissement;
