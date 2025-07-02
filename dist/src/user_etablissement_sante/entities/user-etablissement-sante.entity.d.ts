import { CodeVerifOtp } from './code-verif-otp.entity';
import { RaisonSuppressionCompte } from './raison-suppression.entity';
import { ExpertSante } from './expert_sante.entity';
import { Conversation } from 'src/Discussion_agent_client/conversations/entities/conversation.entity';
export declare class UserEtablissementSante {
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
    otps: CodeVerifOtp[];
    raisons: RaisonSuppressionCompte[];
    experts: ExpertSante[];
    conversations: Conversation[];
}
