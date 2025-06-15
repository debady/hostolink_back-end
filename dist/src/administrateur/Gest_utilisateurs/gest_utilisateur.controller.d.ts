import { GestUtilisateurService } from './gest_utilisateur.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActivationUserDto } from './dto/activation-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CheckUserDto } from 'src/utilisateur/dto/check-user.dto';
export declare class GestUtilisateurController {
    private readonly gestUtilisateurService;
    constructor(gestUtilisateurService: GestUtilisateurService);
    checkUser(checkUserDto: CheckUserDto): Promise<{
        success: boolean;
        exists: boolean;
        identifier: string;
    }>;
    findAll(): Promise<{
        total: number;
        utilisateurs: any[];
    }>;
    findOne(id: string): Promise<Omit<import("../../utilisateur/entities/user.entity").User, "images"> & {
        image_profil: string | null;
    }>;
    updateBanReason(id: string, updateUserDto: UpdateUserDto): Promise<import("../../utilisateur/entities/user.entity").User & {
        image_profil: string | null;
    }>;
    remove(id: string): Promise<void>;
    updateActivation(id: string, activationUserDto: ActivationUserDto): Promise<import("../../utilisateur/entities/user.entity").User>;
    resetPassword(id: string, resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
