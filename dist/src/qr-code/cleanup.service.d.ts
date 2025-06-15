import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';
import { QrCodeService } from './qr-code.service';
export declare class CleanupService implements OnModuleInit {
    private readonly qrCodeService;
    private readonly qrCodeDynamiqueRepository;
    private readonly logger;
    private qrCodeUpdateTimers;
    constructor(qrCodeService: QrCodeService, qrCodeDynamiqueRepository: Repository<QrCodeDynamique>);
    onModuleInit(): Promise<void>;
    scheduleAllActiveQrCodeUpdates(): Promise<void>;
    scheduleQrCodeUpdate(qrCode: QrCodeDynamique): void;
    updateQrCodeToken(qrCodeId: number): Promise<void>;
    scheduledCleanup(): Promise<void>;
    deactivateExpiredQrCodes(): Promise<void>;
    removeOldQrCodes(): Promise<void>;
    manualCleanup(): Promise<{
        deleted: number;
    }>;
}
