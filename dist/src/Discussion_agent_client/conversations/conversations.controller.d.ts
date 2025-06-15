import { ConversationService } from './conversations.service';
import { CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto';
export declare class ConversationController {
    private readonly conversationService;
    constructor(conversationService: ConversationService);
    findAll(userId?: string, assistantId?: number, etablissementId?: number): Promise<import("./entities/conversation.entity").Conversation[]>;
    getActiveConversations(): Promise<import("./entities/conversation.entity").Conversation[]>;
    findOne(id: string): Promise<import("./entities/conversation.entity").Conversation>;
    getActiveConversationForUser(userId: string): Promise<import("./entities/conversation.entity").Conversation>;
    getActiveConversationForEtablissement(etablissementId: string): Promise<import("./entities/conversation.entity").Conversation>;
    countByAssistant(assistantId: string): Promise<{
        count: number;
    }>;
    create(createConversationDto: CreateConversationDto): Promise<import("./entities/conversation.entity").Conversation>;
    update(id: string, updateConversationDto: UpdateConversationDto): Promise<import("./entities/conversation.entity").Conversation>;
    archive(id: string): Promise<import("./entities/conversation.entity").Conversation>;
}
