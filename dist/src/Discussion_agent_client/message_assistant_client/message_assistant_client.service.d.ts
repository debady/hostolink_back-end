import { Repository } from 'typeorm';
import { MessageAssistantClient } from './entities/message-assistant-client.entity';
import { MessageAssistantClientImage } from '../messages_assistant_client_image/entities/message-assistant-client-image.entity';
import { CreateMessageDto, CreateMessageWithImageDto } from './dto/message.dto';
import { CreateImageDto } from '../messages_assistant_client_image/dto/image_message.dto';
import { ConversationService } from '../conversations/conversations.service';
export declare class MessageService {
    private messageRepository;
    private imageRepository;
    private conversationService;
    constructor(messageRepository: Repository<MessageAssistantClient>, imageRepository: Repository<MessageAssistantClientImage>, conversationService: ConversationService);
    findByConversation(conversationId: number): Promise<MessageAssistantClient[]>;
    findOne(id: number): Promise<MessageAssistantClient>;
    create(createDto: CreateMessageDto): Promise<MessageAssistantClient>;
    createWithImage(createMessageDto: CreateMessageWithImageDto): Promise<MessageAssistantClient>;
    addImageToMessage(messageId: number, createImageDto: CreateImageDto): Promise<MessageAssistantClientImage>;
    countByConversation(conversationId: number): Promise<number>;
    getLastMessagesByConversation(conversationId: number, limit?: number): Promise<MessageAssistantClient[]>;
}
