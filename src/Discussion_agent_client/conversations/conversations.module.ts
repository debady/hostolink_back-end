// import { Module } from '@nestjs/common';
// import { ConversationService } from './conversations.service';
// import { ConversationController } from './conversations.controller';

// @Module({
//   providers: [ConversationService],
//   controllers: [ConversationController]
// })
// export class ConversationsModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { QuestionService } from '../questions_predefinies/questions_predefinies.service';
import { MessageAssistantClient } from '../message_assistant_client/entities/message-assistant-client.entity';
import { QuestionsPredefinies } from '../questions_predefinies/entities/question-predefinie.entity';
import { ConversationController } from './conversations.controller';
import { ConversationService } from './conversations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
      MessageAssistantClient,
      QuestionsPredefinies, // si nécessaire
    ]),
  ],
  controllers: [ConversationController],
  providers: [ConversationService, QuestionService],
  exports: [ConversationService],
})
export class ConversationsModule {}
