import { Repository } from 'typeorm';
import { User } from '../../utilisateur/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActivationUserDto } from './dto/activation-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { DataSource } from 'typeorm';
export declare class GestUtilisateurService {
    private readonly userRepository;
    private readonly dataSource;
    constructor(userRepository: Repository<User>, dataSource: DataSource);
    checkUserExistence(identifier: string): Promise<boolean>;
    findAll(): Promise<{
        total: number;
        utilisateurs: any[];
    }>;
    findOne(id_user: string): Promise<Omit<User, 'images'> & {
        image_profil: string | null;
    }>;
    updateBanReason(id_user: string, updateUserDto: UpdateUserDto): Promise<User & {
        image_profil: string | null;
    }>;
    remove(id_user: string): Promise<void>;
    updateActivation(id_user: string, activationUserDto: ActivationUserDto): Promise<User>;
    resetPassword(id_user: string, resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
