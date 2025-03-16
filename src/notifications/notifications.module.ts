import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { NotificationsController } from './notifications.controller';

@Module({
  providers: [EmailService],
  controllers: [NotificationsController],
  exports: [EmailService],
})
export class NotificationsModule {}

