"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const message_assistant_client_entity_1 = require("./entities/message-assistant-client.entity");
const message_assistant_client_image_entity_1 = require("../messages_assistant_client_image/entities/message-assistant-client-image.entity");
const conversations_service_1 = require("../conversations/conversations.service");
let MessageService = class MessageService {
    constructor(messageRepository, imageRepository, conversationService) {
        this.messageRepository = messageRepository;
        this.imageRepository = imageRepository;
        this.conversationService = conversationService;
    }
    async findByConversation(conversationId) {
        return this.messageRepository.find({
            where: { conversationId },
            relations: ['images', 'questionSugerer'],
            order: { sentAt: 'ASC' },
        });
    }
    async findOne(id) {
        const message = await this.messageRepository.findOne({
            where: { id },
            relations: ['images', 'questionSugerer'],
        });
        if (!message) {
            throw new common_1.NotFoundException(`Message avec l'ID ${id} non trouvé`);
        }
        return message;
    }
    async create(createDto) {
        let conversationId = createDto.conversationId;
        if (!conversationId) {
            const conversation = await this.conversationService.getOrCreateConversation(createDto.userId, createDto.etablissementSanteId, createDto.assistantId, createDto.questionSugererId);
            conversationId = conversation.id;
        }
        const message = this.messageRepository.create({
            conversationId: conversationId,
            envoyerPar: createDto.envoyerPar,
            messageText: createDto.messageText,
            questionSugererId: createDto.questionSugererId,
            hasFile: false,
        });
        return await this.messageRepository.save(message);
    }
    async createWithImage(createMessageDto) {
        let conversationId = createMessageDto.conversationId;
        if (!conversationId) {
            const conversation = await this.conversationService.getOrCreateConversation(createMessageDto.userId, createMessageDto.etablissementSanteId, createMessageDto.assistantId, createMessageDto.questionSugererId);
            conversationId = conversation.id;
        }
        const message = this.messageRepository.create({
            conversationId: conversationId,
            envoyerPar: createMessageDto.envoyerPar,
            messageText: createMessageDto.messageText,
            QuestionsPredefinies: createMessageDto.QuestionsPredefinies || false,
            questionSugererId: createMessageDto.questionSugererId,
            hasFile: createMessageDto.images && createMessageDto.images.length > 0,
        });
        const savedMessage = await this.messageRepository.save(message);
        if (createMessageDto.images && createMessageDto.images.length > 0) {
            const imageEntities = createMessageDto.images.map(img => {
                return this.imageRepository.create({
                    messageId: savedMessage.id,
                    imageUrl: img.imageUrl,
                    altText: img.altText,
                });
            });
            await this.imageRepository.save(imageEntities);
        }
        return this.findOne(savedMessage.id);
    }
    async addImageToMessage(messageId, createImageDto) {
        const message = await this.findOne(messageId);
        const image = this.imageRepository.create({
            messageId: message.id,
            imageUrl: createImageDto.imageUrl,
            altText: createImageDto.altText,
        });
        const savedImage = await this.imageRepository.save(image);
        if (!message.hasFile) {
            message.hasFile = true;
            await this.messageRepository.save(message);
        }
        return savedImage;
    }
    async countByConversation(conversationId) {
        return this.messageRepository.count({
            where: { conversationId },
        });
    }
    async getLastMessagesByConversation(conversationId, limit = 10) {
        return this.messageRepository.find({
            where: { conversationId },
            relations: ['images', 'questionSugerer'],
            order: { sentAt: 'DESC' },
            take: limit,
        });
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_assistant_client_entity_1.MessageAssistantClient)),
    __param(1, (0, typeorm_1.InjectRepository)(message_assistant_client_image_entity_1.MessageAssistantClientImage)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => conversations_service_1.ConversationService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        conversations_service_1.ConversationService])
], MessageService);
//# sourceMappingURL=message_assistant_client.service.js.map