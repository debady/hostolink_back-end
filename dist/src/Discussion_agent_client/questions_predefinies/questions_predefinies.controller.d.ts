import { QuestionService } from './questions_predefinies.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
export declare class QuestionController {
    private readonly questionService;
    constructor(questionService: QuestionService);
    findAll(assistantId?: number, category?: string, Agent?: boolean): Promise<import("./entities/question-predefinie.entity").QuestionsPredefinies[]>;
    findOne(id: string): Promise<import("./entities/question-predefinie.entity").QuestionsPredefinies>;
    create(createQuestionDto: CreateQuestionDto): Promise<import("./entities/question-predefinie.entity").QuestionsPredefinies>;
    update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<import("./entities/question-predefinie.entity").QuestionsPredefinies>;
    remove(id: string): Promise<{
        message: string;
    }>;
    toggleActive(id: string): Promise<import("./entities/question-predefinie.entity").QuestionsPredefinies>;
}
