import { MessageService } from './message_assistant_client.service';
import { CloudinaryService } from 'config/cloudinary.config';
import { CreateMessageDto } from './dto/message.dto';
export declare class MessageController {
    private readonly messageService;
    private readonly cloudinaryService;
    constructor(messageService: MessageService, cloudinaryService: CloudinaryService);
    findByConversation(conversationId: string): Promise<import("./entities/message-assistant-client.entity").MessageAssistantClient[]>;
    getLastMessages(conversationId: string, limit?: number): Promise<import("./entities/message-assistant-client.entity").MessageAssistantClient[]>;
    countByConversation(conversationId: string): Promise<{
        count: number;
    }>;
    findOne(id: string): Promise<import("./entities/message-assistant-client.entity").MessageAssistantClient>;
    create(createMessageDto: CreateMessageDto): Promise<import("./entities/message-assistant-client.entity").MessageAssistantClient>;
    createWithImage(createMessageDto: CreateMessageDto, file: Express.Multer.File): Promise<import("./entities/message-assistant-client.entity").MessageAssistantClient>;
    addImageToMessage(id: string, file: Express.Multer.File): Promise<import("../messages_assistant_client_image/entities/message-assistant-client-image.entity").MessageAssistantClientImage>;
}
