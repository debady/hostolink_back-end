import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly emailService: EmailService) {}

  @Get('test-email')
  async sendTestEmail() {
    return await this.emailService.testSendEmail();
  }
}
