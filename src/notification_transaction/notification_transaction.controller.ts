// ----------------------
// Contrôleur Notification
// ----------------------
import { Controller, Get, Param, Patch, NotFoundException } from '@nestjs/common';
import { NotificationService } from './notification_transaction.module';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('etablissement/:id')
  getEstablishmentNotifications(@Param('id') id: string) {
    return this.notificationService.getEstablishmentNotifications(+id);
  }

  @Get('user/:id')
  getUserNotifications(@Param('id') id: string) {
    return this.notificationService.getUserNotifications(id);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    try {
      await this.notificationService.markAsRead(+id);
      return { success: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Erreur lors du marquage de la notification comme lue');
    }
  }
}