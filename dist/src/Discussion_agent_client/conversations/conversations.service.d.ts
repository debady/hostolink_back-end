import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { MessageAssistantClient } from '../message_assistant_client/entities/message-assistant-client.entity';
import { QuestionService } from '../questions_predefinies/questions_predefinies.service';
import { CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto';
import { AgentAssistanceService } from 'src/agent-assistant/agent-assistant.service';
import { MessageService } from '../message_assistant_client/message_assistant_client.service';
export declare class ConversationService {
    private conversationRepository;
    private messageRepository;
    private questionService;
    private agentService;
    private messageService;
    constructor(conversationRepository: Repository<Conversation>, messageRepository: Repository<MessageAssistantClient>, questionService: QuestionService, agentService: AgentAssistanceService, messageService: MessageService);
    findAll(): Promise<Conversation[]>;
    findByUser(userId: string): Promise<Conversation[]>;
    findByEtablissementSante(etablissementSanteId: number): Promise<Conversation[]>;
    findByAssistant(assistantId: number): Promise<Conversation[]>;
    findOne(id: number): Promise<Conversation>;
    getActiveConversationForUser(userId: string): Promise<Conversation | null>;
    getActiveConversationForEtablissement(etablissementSanteId: number): Promise<Conversation | null>;
    getOrCreateConversation(userId?: string, etablissementSanteId?: number, assistantId?: number, initialQuestionId?: number): Promise<Conversation>;
    create(createConversationDto: CreateConversationDto): Promise<Conversation>;
    update(id: number, updateConversationDto: UpdateConversationDto): Promise<Conversation>;
    archive(id: number): Promise<Conversation>;
    countByAssistant(assistantId: number): Promise<number>;
    getActiveConversations(): Promise<Conversation[]>;
}
