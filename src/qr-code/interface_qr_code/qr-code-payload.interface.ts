// src/qr-code/interfaces/qr-code-payload.interface.ts
export enum QrCodeType {
  STATIC = 'static',
  DYNAMIC = 'dynamic'
}

export enum RecipientType {
  USER = 'utilisateur',
  ETABLISSEMENT = 'etablissement'
}

export interface QrCodePayload {
  recipientType: RecipientType;
  recipientId: string | number; // string pour UUID (user), number pour integer (établissement)
  accountNumber?: string;
  currency?: string;
  qrType: QrCodeType;
  timestamp: number;
  expiresAt?: number; // Uniquement pour les QR codes dynamiques
}