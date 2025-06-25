import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from './notif_push.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  async sendManualNotification(
    @Body('token') token: string,
    @Body('title') title: string,
    @Body('body') body: string
  ) {
    const messageId = await this.notificationService.sendToToken(token, title, body);
    return { success: true, messageId };
  }
}
