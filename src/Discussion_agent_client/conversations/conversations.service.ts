// // src/services/conversation.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Conversation } from './entities/conversation.entity';
// import { MessageAssistantClient } from '../message_assistant_client/entities/message-assistant-client.entity';
// import { QuestionService } from '../questions_predefinies/questions_predefinies.service';
// import { CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto';


// @Injectable()
// export class ConversationService {
//   constructor(
//     @InjectRepository(Conversation)
//     private conversationRepository: Repository<Conversation>,
//     @InjectRepository(MessageAssistantClient)
//     private messageRepository: Repository<MessageAssistantClient>,
//     private questionService: QuestionService,
//   ) {}

//   async findAll(): Promise<Conversation[]> {
//     return this.conversationRepository.find();
//   }

//   async findByUser(userId: string): Promise<Conversation[]> {
//     return this.conversationRepository.find({
//       where: { userId },
//       order: { startTime: 'DESC' },
//     });
//   }

//   async findByEtablissementSante(etablissementSanteId: number): Promise<Conversation[]> {
//     return this.conversationRepository.find({
//       where: { etablissementSanteId },
//       order: { startTime: 'DESC' },
//     });
//   }

//   async findByAssistant(assistantId: number): Promise<Conversation[]> {
//     return this.conversationRepository.find({
//       where: { assistantId },
//       order: { startTime: 'DESC' },
//     });
//   }

//   async findOne(id: number): Promise<Conversation> {
//     const conversation = await this.conversationRepository.findOne({
//       where: { id },
//       relations: ['messages', 'messages.images', 'messages.questionSugerer'],
//     });
    
//     if (!conversation) {
//       throw new NotFoundException(`Conversation avec l'ID ${id} non trouvée`);
//     }
    
//     return conversation;
//   }

//   async create(createConversationDto: CreateConversationDto): Promise<Conversation> {
//     const conversation = this.conversationRepository.create({
//       userId: createConversationDto.userId,
//       etablissementSanteId: createConversationDto.etablissementSanteId,
//       assistantId: createConversationDto.assistantId,
//       status: 'active',
//     });
    
//     const savedConversation = await this.conversationRepository.save(conversation);
    
//     // Si une question initiale est fournie, créer le premier message
//     if (createConversationDto.initialQuestionId) {
//       const question = await this.questionService.findOne(createConversationDto.initialQuestionId);
      
//       const message = this.messageRepository.create({
//         conversationId: savedConversation.id,
//         envoyerPar: 'user',
//         messageText: question.questionText,
//         questionPredefinie: true,
//         questionSugererId: question.id,
//         hasFile: false,
//       });
      
//       await this.messageRepository.save(message);
//     }
    
//     return this.findOne(savedConversation.id);
//   }

//   async update(id: number, updateConversationDto: UpdateConversationDto): Promise<Conversation> {
//     const conversation = await this.findOne(id);
//     const updated = Object.assign(conversation, updateConversationDto);
//     await this.conversationRepository.save(updated);
//     return this.findOne(id);
//   }

//   async archive(id: number): Promise<Conversation> {
//     const conversation = await this.findOne(id);
//     conversation.status = 'archived';
//     await this.conversationRepository.save(conversation);
//     return this.findOne(id);
//   }

//   async countByAssistant(assistantId: number): Promise<number> {
//     return this.conversationRepository.count({
//       where: { assistantId },
//     });
//   }

//   async getActiveConversations(): Promise<Conversation[]> {
//     return this.conversationRepository.find({
//       where: { status: 'active' },
//       order: { startTime: 'DESC' },
//     });
//   }
// }