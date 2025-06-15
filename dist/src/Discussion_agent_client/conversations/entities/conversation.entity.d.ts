import { AgentAssistance } from 'src/agent-assistant/entities/agent-assistance.entity';
import { MessageAssistantClient } from 'src/Discussion_agent_client/message_assistant_client/entities/message-assistant-client.entity';
import { UserEtablissementSante } from 'src/user_etablissement_sante/entities/user-etablissement-sante.entity';
import { User } from 'src/utilisateur/entities/user.entity';
export declare class Conversation {
    id: number;
    userId: string;
    etablissementSanteId: number;
    assistantId: number;
    startTime: Date;
    status: string;
    autoCreated: boolean;
    user: User;
    assistant: AgentAssistance;
    etablissementSante: UserEtablissementSante;
    messages: MessageAssistantClient[];
}
