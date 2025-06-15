import { OnModuleInit } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { QrCodePaiementDynamique } from './entities/qr_code_paiement_dynamique.entity';
import { Transaction } from './entities/transaction.entity';
export declare class QrDynamiqueService implements OnModuleInit {
    private readonly dataSource;
    private readonly qrRepo;
    private readonly transactionRepo;
    constructor(dataSource: DataSource, qrRepo: Repository<QrCodePaiementDynamique>, transactionRepo: Repository<Transaction>);
    onModuleInit(): void;
    generateShortId(): string;
    private startQrGenerationLoop;
    getQrActifOuNouveau(idEtablissement: number): Promise<QrCodePaiementDynamique>;
    validerQrEtInvalider(token: string): Promise<{
        message: string;
        etablissement_id: number;
    }>;
    private generateToken;
}
