export declare class ImageDto {
    imageUrl: string;
    altText?: string;
}
export declare class CreateMessageDto {
    conversationId?: number;
    userId?: string;
    etablissementSanteId?: number;
    assistantId?: number;
    envoyerPar: string;
    messageText: string;
    questionSugererId?: number;
    QuestionsPredefinies?: boolean;
}
export declare class CreateMessageWithImageDto extends CreateMessageDto {
    images?: ImageDto[];
}
export declare class MessageResponseDto {
    id: number;
    conversationId: number;
    envoyerPar: string;
    messageText: string;
    sentAt: Date;
    hasFile: boolean;
    questionSugererId?: number;
    questionSugerer?: any;
    images?: any[];
}
