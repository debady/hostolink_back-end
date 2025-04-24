// src/services/message.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageAssistantClient } from './entities/message-assistant-client.entity';
import { MessageAssistantClientImage } from '../messages_assistant_client_image/entities/message-assistant-client-image.entity';
import { CreateMessageDto, CreateMessageWithImageDto } from './dto/message.dto';
import { CreateImageDto } from '../messages_assistant_client_image/dto/image_message.dto';


@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageAssistantClient)
    private messageRepository: Repository<MessageAssistantClient>,
    @InjectRepository(MessageAssistantClientImage)
    private imageRepository: Repository<MessageAssistantClientImage>,
  ) {}

  async findByConversation(conversationId: number): Promise<MessageAssistantClient[]> {
    return this.messageRepository.find({
      where: { conversationId },
      relations: ['images', 'questionSugerer'],
      order: { sentAt: 'ASC' },
    });
  }

  async findOne(id: number): Promise<MessageAssistantClient> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['images', 'questionSugerer'],
    });
    
    if (!message) {
      throw new NotFoundException(`Message avec l'ID ${id} non trouvé`);
    }
    
    return message;
  }

  async create(createMessageDto: CreateMessageDto): Promise<MessageAssistantClient> {
    const message = this.messageRepository.create({
      ...createMessageDto,
      hasFile: false,
    });
    
    const savedMessage = await this.messageRepository.save(message);
    return this.findOne(savedMessage.id);
  }

  async createWithImage(createMessageDto: CreateMessageWithImageDto): Promise<MessageAssistantClient> {
    // Créer d'abord le message
    const message = this.messageRepository.create({
      conversationId: createMessageDto.conversationId,
      envoyerPar: createMessageDto.envoyerPar,
      messageText: createMessageDto.messageText,
      QuestionsPredefinies: createMessageDto.QuestionsPredefinies || false,
      questionSugererId: createMessageDto.questionSugererId,
      hasFile: createMessageDto.images && createMessageDto.images.length > 0,
    });
    
    const savedMessage = await this.messageRepository.save(message);
    
    // Ajouter les images si présentes
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
    
    // Récupérer le message avec les images
    return this.findOne(savedMessage.id);
  }

  async addImageToMessage(messageId: number, createImageDto: CreateImageDto): Promise<MessageAssistantClientImage> {
    const message = await this.findOne(messageId);
    
    // Créer et sauvegarder l'image
    const image = this.imageRepository.create({
      messageId: message.id,
      imageUrl: createImageDto.imageUrl,
      altText: createImageDto.altText,
    });
    
    const savedImage = await this.imageRepository.save(image);
    
    // Mettre à jour le flag hasFile du message
    if (!message.hasFile) {
      message.hasFile = true;
      await this.messageRepository.save(message);
    }
    
    return savedImage;
  }
  
  async countByConversation(conversationId: number): Promise<number> {
    return this.messageRepository.count({
      where: { conversationId },
    });
  }
  
  async getLastMessagesByConversation(conversationId: number, limit: number = 10): Promise<MessageAssistantClient[]> {
    return this.messageRepository.find({
      where: { conversationId },
      relations: ['images', 'questionSugerer'],
      order: { sentAt: 'DESC' },
      take: limit,
    });
  }
}