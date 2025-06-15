import { QrCodeService } from './qr-code.service';
export declare class QrCodeController {
    private readonly qrCodeService;
    constructor(qrCodeService: QrCodeService);
    generateDynamicQrCode(req: any, body: {
        expiresIn?: number;
    }): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
            id_qrcode: number;
            short_id: string;
            token: string;
            date_expiration: Date;
            remaining_seconds: number;
            qr_code_image: string;
        };
    }>;
    getStaticQrCode(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id_qrcode: number;
            short_id: string;
            token: string;
            qr_code_image: string;
        };
    }>;
    getMyDynamicQrCode(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id_qrcode: number;
            short_id: string;
            token: string;
            date_expiration: Date;
            remaining_seconds: number;
            qr_code_image: string;
        };
    }>;
    validateQrCode(body: {
        token: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: any;
    } | {
        success: boolean;
        message: any;
        data: null;
    }>;
    refreshAllStaticQrCodes(): Promise<number>;
    refreshDynamicQrCode(req: any, body: {
        expiresIn?: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id_qrcode: number;
            short_id: string;
            token: string;
            date_expiration: Date;
            remaining_seconds: number;
            qr_code_image: string;
        };
    }>;
    getAllUserQrCodes(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            static: {
                qr_code_image: string;
                id_qrcode: number;
                short_id: string;
                id_user_etablissement_sante: number;
                id_user: string;
                token: string;
                date_creation: Date;
                date_expiration: Date;
                statut: string;
                user: import("../utilisateur/entities/user.entity").User;
            }[];
            dynamic: {
                remaining_seconds: number;
                qr_code_image: string;
                id_qrcode: number;
                short_id: string;
                id_user_etablissement_sante: number;
                id_user: string;
                token: string;
                date_creation: Date;
                date_expiration: Date;
                statut: string;
                user: import("../utilisateur/entities/user.entity").User;
            }[];
        };
    }>;
    getUserQrCodes(id_user: string): Promise<{
        success: boolean;
        message: string;
        data: {
            static: {
                qr_code_image: string;
                id_qrcode: number;
                short_id: string;
                id_user_etablissement_sante: number;
                id_user: string;
                token: string;
                date_creation: Date;
                date_expiration: Date;
                statut: string;
                user: import("../utilisateur/entities/user.entity").User;
            }[];
            dynamic: {
                remaining_seconds: number;
                qr_code_image: string;
                id_qrcode: number;
                short_id: string;
                id_user_etablissement_sante: number;
                id_user: string;
                token: string;
                date_creation: Date;
                date_expiration: Date;
                statut: string;
                user: import("../utilisateur/entities/user.entity").User;
            }[];
        };
    }>;
    getQrCodeById(type: string, id_qrcode: number): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
            remaining_seconds: number | undefined;
            qr_code_image: string;
            id_qrcode: number;
            short_id: string;
            id_user_etablissement_sante: number;
            id_user: string;
            token: string;
            date_creation: Date;
            date_expiration: Date;
            statut: string;
            user: import("../utilisateur/entities/user.entity").User;
        } | {
            remaining_seconds: number | undefined;
            qr_code_image: string;
            id_qrcode: number;
            short_id: string;
            id_user_etablissement_sante: number;
            id_user: string;
            token: string;
            date_creation: Date;
            date_expiration: Date;
            statut: string;
            user: import("../utilisateur/entities/user.entity").User;
        };
    }>;
}
