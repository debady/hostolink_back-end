import { Repository } from 'typeorm';
import { QuestionsPredefinies } from './entities/question-predefinie.entity';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
export declare class QuestionService {
    private QuestionsPredefiniesRepository;
    constructor(QuestionsPredefiniesRepository: Repository<QuestionsPredefinies>);
    findAll(): Promise<QuestionsPredefinies[]>;
    findAllAgent(): Promise<QuestionsPredefinies[]>;
    findByAssistant(assistantId: number): Promise<QuestionsPredefinies[]>;
    findByCategory(category: string): Promise<QuestionsPredefinies[]>;
    findByAssistantAndCategory(assistantId: number, category: string): Promise<QuestionsPredefinies[]>;
    findOne(id: number): Promise<QuestionsPredefinies>;
    create(createQuestionDto: CreateQuestionDto): Promise<QuestionsPredefinies>;
    update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<QuestionsPredefinies>;
    remove(id: number): Promise<void>;
    toggleActive(id: number): Promise<QuestionsPredefinies>;
}
