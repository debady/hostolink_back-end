import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { QrCodePayload } from '../interface_qr_code/qr-code-payload.interface';
export declare class QrCodeJwtService {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    generateToken(payload: QrCodePayload, isStatic: boolean): string;
    verifyToken(token: string, isStatic?: boolean): QrCodePayload;
}
