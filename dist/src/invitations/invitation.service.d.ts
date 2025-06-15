import { Repository } from 'typeorm';
import { Invitation } from './entities/invitation.entity';
import { User } from 'src/utilisateur/entities/user.entity';
import { InvitationTracking } from './entities/invitation_traking.entity';
import { Compte } from 'src/compte/entitie/compte.entity';
export declare class InvitationService {
    private readonly invitationRepository;
    private readonly userRepository;
    private readonly trackingRepository;
    private readonly compteRepository;
    constructor(invitationRepository: Repository<Invitation>, userRepository: Repository<User>, trackingRepository: Repository<InvitationTracking>, compteRepository: Repository<Compte>);
    getOrCreateInvitation(id_user: string): Promise<{
        code: string;
        lien: string;
    }>;
    enregistrerClic(code_invitation: string, ip: string, userAgent: string): Promise<void>;
    incrementerNombrePartages(code_invitation: string): Promise<{
        message: string;
    }>;
}
