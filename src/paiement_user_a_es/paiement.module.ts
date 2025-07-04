import { Module } from '@nestjs/common';
import { PaiementService } from './paiement.service';
import { PaiementController } from './paiement.controller';
import { NotificationModule } from 'src/module_notification_push/notif_push.module';

@Module({
   imports: [NotificationModule],
  providers: [PaiementService],
  controllers: [PaiementController],
})
export class PaiementModule {}
