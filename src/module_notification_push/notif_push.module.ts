import { Module } from '@nestjs/common';
import { NotifPushService } from './notif_push.service';
import { NotifPushController } from './notif_push.controller';

@Module({
  providers: [NotifPushService],
  controllers: [NotifPushController],
  exports: [NotifPushService], // Pour l’injecter ailleurs
})
export class NotifPushModule {}