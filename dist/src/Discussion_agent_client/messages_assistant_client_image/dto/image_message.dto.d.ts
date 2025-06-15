export declare class MessageImageDto {
    imageUrl: string;
    altText?: string;
}
export declare class CreateImageDto {
    messageId: number;
    imageUrl: string;
    altText?: string;
}
export declare class MessageImageResponseDto {
    id: number;
    messageId: number;
    imageUrl: string;
    altText?: string;
    uploadedAt: Date;
}
