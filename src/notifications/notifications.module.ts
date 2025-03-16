import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NotificationsController } from './notifications.controller';
import { SmsService } from './sms.service';

@Module({
  providers: [EmailService, SmsService],
  controllers: [NotificationsController],
  exports: [EmailService,SmsService],
})
export class NotificationsModule {}


