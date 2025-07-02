import { Image } from '../../image/entities/image.entity';
import { MessageThematique } from 'src/1-Module_reseaux_sociale/thematique_discussion/entities/message_thematique.entity';
import { Otp } from './otp.entity';
import { Conversation } from 'src/Discussion_agent_client/conversations/entities/conversation.entity';
import { DocumentsIdentiteEntity } from 'src/documents_identite/entities/documents_identite.entity';
export declare class User {
    id_user: string;
    email?: string;
    telephone?: string;
    mdp?: string;
    nom?: string;
    prenom?: string;
    pays?: string;
    date_inscription: Date;
    dernier_otp_envoye?: Date;
    raison_banni?: string;
    compte_verifier: boolean;
    otps?: Otp[];
    position?: any;
    images?: Image[];
    actif: boolean;
    messagesEnvoyes: MessageThematique[];
    fcm_token: string;
    code_invitation_utilise: string | null;
    conversations: Conversation[];
    document_identite: DocumentsIdentiteEntity;
}
