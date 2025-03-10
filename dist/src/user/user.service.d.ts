import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    checkUserExistence(identifier: string): Promise<boolean>;
    registerUser(identifier: string): Promise<{
        success: boolean;
        message: string;
    }>;
    setUserPassword(identifier: string, password: string): Promise<boolean>;
    verifyUserPin(identifier: string, pin: string): Promise<boolean>;
    getAllUsers(): Promise<{
        success: boolean;
        users: User[];
    }>;
    getUserById(id_user: number): Promise<User | null>;
    findUserByIdentifier(identifier: string): Promise<User | null>;
    findUserById(id_user: number): Promise<User | null>;
}
