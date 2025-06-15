import { MessageResponseDto } from 'src/Discussion_agent_client/message_assistant_client/dto/message.dto';
export declare class CreateConversationDto {
    userId?: string;
    etablissementSanteId?: number;
    assistantId: number;
    initialQuestionId?: number;
}
export declare class UpdateConversationDto {
    status?: string;
}
export declare class ConversationResponseDto {
    id: number;
    userId?: string;
    etablissementSanteId?: number;
    assistantId: number;
    startTime: Date;
    status: string;
}
export declare class ConversationDetailResponseDto extends ConversationResponseDto {
    messages: MessageResponseDto[];
}
