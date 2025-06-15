import { Conversation } from '../../conversations/entities/conversation.entity';
import { QuestionsPredefinies } from '../../questions_predefinies/entities/question-predefinie.entity';
import { MessageAssistantClientImage } from '../../messages_assistant_client_image/entities/message-assistant-client-image.entity';
export declare class MessageAssistantClient {
    id: number;
    conversationId: number;
    envoyerPar: string;
    messageText: string;
    sentAt: Date;
    QuestionsPredefinies: boolean;
    questionSugererId: number;
    hasFile: boolean;
    conversation: Conversation;
    questionSugerer: QuestionsPredefinies;
    images: MessageAssistantClientImage[];
}
