// import { Module } from '@nestjs/common';
// import { MessageService } from './message_assistant_client.service';
// import { MessageController } from './message_assistant_client.controller';

// @Module({
//   providers: [MessageService],
//   controllers: [MessageController]
// })
// export class MessageAssistantClientModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageAssistantClient } from './entities/message-assistant-client.entity';
import { MessageService } from './message_assistant_client.service';
import { MessageAssistantClientImage } from '../messages_assistant_client_image/entities/message-assistant-client-image.entity';
import { CloudinaryService } from 'config/cloudinary.config';


@Module({
  imports: [TypeOrmModule.forFeature([MessageAssistantClient, MessageAssistantClientImage, CloudinaryService])],
  providers: [MessageService],
  exports: [MessageService], // si utilisé ailleurs
})
export class MessageAssistantClientModule {}
