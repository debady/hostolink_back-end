import { UserEtablissementSanteService } from './user-etablissement-sante.service';
import { CreateUserEtablissementDto } from './dto/create-user-etablissement.dto';
import { UpdateProfileEtablissementDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { Request } from 'express';
export interface AuthenticatedRequest extends Request {
    user_etablissement?: number;
}
export declare class UserEtablissementSanteController {
    private readonly userEtablissementSanteService;
    private readonly service;
    constructor(userEtablissementSanteService: UserEtablissementSanteService, service: UserEtablissementSanteService);
    register(dto: CreateUserEtablissementDto): Promise<{
        message: string;
    }>;
    verify(body: {
        email: string;
        code: string;
    }): Promise<{
        message: string;
        user: {
            id: number;
            nom: string;
            email: string;
            categorie: string;
        };
    }>;
    login(body: {
        email: string;
        fcm_token?: string;
    }): Promise<{
        message: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
        image_profil: string | null;
        compte: any;
        qr_code_statique: any;
        qr_code_dynamique: any;
        id_user_etablissement_sante: number;
        nom: string;
        telephone: string;
        categorie: string;
        adresse: string;
        creatAt: Date;
        latitude: number;
        longitude: number;
        geom: any;
        specialites: string;
        email: string;
        mot_de_passe: string;
        compte_verifie: boolean;
        numero_wave: string;
        wave_verified: boolean;
        otps: import("./entities/code-verif-otp.entity").CodeVerifOtp[];
        raisons: import("./entities/raison-suppression.entity").RaisonSuppressionCompte[];
        experts: import("./entities/expert_sante.entity").ExpertSante[];
        conversations: import("../Discussion_agent_client/conversations/entities/conversation.entity").Conversation[];
        fcm_token?: string;
    }>;
    updateProfile(req: any, dto: UpdateProfileEtablissementDto): Promise<import("./entities/user-etablissement-sante.entity").UserEtablissementSante>;
    regenerateOtp(identifiant: string): Promise<{
        message: string;
    }>;
    changePassword(dto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    deleteAccount(req: any, dto: DeleteAccountDto): Promise<{
        message: string;
    }>;
    uploadAvatar(file: Express.Multer.File, req: any): Promise<{
        message: string;
        url: any;
    }>;
    uploadAvatarAuthenticated(file: Express.Multer.File, req: any): Promise<{
        message: string;
        url: any;
    }>;
    getAllEmailsForEs(req: AuthenticatedRequest): Promise<string[]>;
    getAllTelephonesForEs(req: AuthenticatedRequest): Promise<string[]>;
    checkIdentifier(req: AuthenticatedRequest, body: {
        identifier: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/user-etablissement-sante.entity").UserEtablissementSante;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
    updateFcmToken(req: any, body: {
        fcm_token: string;
    }): Promise<{
        message: string;
    }>;
}
