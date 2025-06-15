import { Conversation } from 'src/Discussion_agent_client/conversations/entities/conversation.entity';
import { QuestionsPredefinies } from 'src/Discussion_agent_client/questions_predefinies/entities/question-predefinie.entity';
export declare class AgentAssistance {
    id: number;
    idAdminGestionnaire: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    mdp: string;
    statut: string;
    dateCreation: Date;
    dateModification: Date;
    urlPhotoAgent: string;
    questions: QuestionsPredefinies[];
    conversations: Conversation[];
}
