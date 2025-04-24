// src/dtos/message.dto.ts
import { IsNumber, IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageImageDto, MessageImageResponseDto } from 'src/Discussion_agent_client/messages_assistant_client_image/dto/image_message.dto';

export class CreateMessageDto {
  @IsNumber()
  conversationId: number;

  @IsString()
  envoyerPar: string; // 'user' ou 'assistant'

  @IsString()
  @IsOptional()
  messageText?: string;

  @IsBoolean()
  @IsOptional()
  QuestionsPredefinies?: boolean;

  @IsNumber()
  @IsOptional()
  questionSugererId?: number;
}

export class CreateMessageWithImageDto extends CreateMessageDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageImageDto)
  @IsOptional()
  images?: MessageImageDto[];
}

export class MessageResponseDto {
  id: number;
  conversationId: number;
  envoyerPar: string;
  messageText: string;
  sentAt: Date;
  QuestionsPredefinies: boolean;
  questionSugererId?: number;
  hasFile: boolean;
  images?: MessageImageResponseDto[];
}