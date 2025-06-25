import { Module } from '@nestjs/common';
import { NotificationController } from './notif_push.controller';
import { NotificationService } from './notif_push.service';

@Module({
  providers: [NotificationService],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
