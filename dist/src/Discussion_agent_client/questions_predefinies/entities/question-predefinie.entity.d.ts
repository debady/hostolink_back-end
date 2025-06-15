import { AgentAssistance } from 'src/agent-assistant/entities/agent-assistance.entity';
import { MessageAssistantClient } from 'src/Discussion_agent_client/message_assistant_client/entities/message-assistant-client.entity';
export declare class QuestionsPredefinies {
    id: number;
    questionText: string;
    assistantId: number;
    category: string;
    isActive: boolean;
    assistant: AgentAssistance;
    messages: MessageAssistantClient[];
}
