import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';
import { QrCodeStatique } from './entitie/qr_code_statique.entity';
import { QrCodePayload, QrCodePayloadUser } from './interface_qr_code/qr-code-payload.interface';
import { CompteService } from 'src/compte/compte.service';
import { UserService } from 'src/utilisateur/user.service';
import { CleanupService } from './cleanup.service';
export declare class QrCodeService {
    private readonly qrCodeDynamiqueRepository;
    private readonly qrCodeStatiqueRepository;
    private readonly jwtService;
    private readonly configService;
    private readonly compteService;
    private readonly userService;
    private readonly cleanupService;
    constructor(qrCodeDynamiqueRepository: Repository<QrCodeDynamique>, qrCodeStatiqueRepository: Repository<QrCodeStatique>, jwtService: JwtService, configService: ConfigService, compteService: CompteService, userService: UserService, cleanupService: CleanupService);
    generateShortId(): string;
    generateTokenWithPayload(payload: QrCodePayload): string;
    createUserPayload(id_user: string, isDynamic: boolean, expiresIn?: number, additionalInfo?: {
        accountNumber?: string;
        currency?: string;
    }): QrCodePayloadUser;
    createStaticQrForNewUser(id_user: string, accountNumber?: string): Promise<QrCodeStatique>;
    getUserStaticQrCode(id_user: string): Promise<QrCodeStatique | null>;
    createDynamicQrForUser(id_user: string, accountNumber?: string, expiresIn?: number, currency?: string): Promise<QrCodeDynamique>;
    deleteOldExpiredQrCodes(days?: number): Promise<number>;
    verifyToken(token: string): QrCodePayload;
    refreshAllStaticQrCodes(): Promise<number>;
    refreshQrCodeToken(qrCode: QrCodeDynamique): Promise<void>;
    validateQrCode(codeInput: string): Promise<any>;
    generateQrCodeImage(idOrToken: string): Promise<string>;
    refreshUserDynamicQrCode(id_user: string, accountNumber?: string, expiresIn?: number, currency?: string): Promise<QrCodeDynamique>;
    getUserDynamicQrCodes(id_user: string): Promise<QrCodeDynamique[]>;
    getAllUserQrCodes(id_user: string): Promise<{
        static: QrCodeStatique[];
        dynamic: QrCodeDynamique[];
    }>;
    getQrCodeById(id_qrcode: number, type: 'static' | 'dynamic'): Promise<QrCodeStatique | QrCodeDynamique | null>;
}
