import { MessageAssistantClient } from 'src/Discussion_agent_client/message_assistant_client/entities/message-assistant-client.entity';
export declare class MessageAssistantClientImage {
    id: number;
    messageId: number;
    imageUrl: string;
    altText: string;
    uploadedAt: Date;
    message: MessageAssistantClient;
}
