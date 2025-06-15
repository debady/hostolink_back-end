export declare class CreateQuestionDto {
    questionText: string;
    assistantId: number;
    category?: string;
    isActive?: boolean;
}
export declare class UpdateQuestionDto {
    questionText?: string;
    assistantId?: number;
    category?: string;
    isActive?: boolean;
}
export declare class QuestionResponseDto {
    id: number;
    questionText: string;
    assistantId: number;
    category: string;
    isActive: boolean;
}
