import { QrDynamiqueService } from './qr-dynamique.service_es';
export declare class QrDynamiqueController {
    private readonly service;
    constructor(service: QrDynamiqueService);
    getMyQr(req: any): Promise<import("./entities/qr_code_paiement_dynamique.entity").QrCodePaiementDynamique>;
    validateQr(token: string): Promise<{
        message: string;
        etablissement_id: number;
    }>;
}
