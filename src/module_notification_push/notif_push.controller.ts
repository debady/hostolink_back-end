import { Controller, Post, Body } from '@nestjs/common';
import { NotifPushService } from './notif_push.service';

@Controller('notif-push')
export class NotifPushController {
  constructor(private readonly notifPushService: NotifPushService) {}

  @Post('send')
  async send(@Body() body: { token: string; title: string; message: string }) {
    return this.notifPushService.sendPushNotification(body.token, body.title, body.message);
  }
}