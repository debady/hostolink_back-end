import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTransaction } from './entitie/notification_transaction.entity';
import { TransactionModule } from 'src/transaction-interne/transaction-interne.module';
import { NotificationController } from './notification_transaction.controller';
import { NotificationService } from './notification_transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationTransaction]),
    TransactionModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}

export { NotificationService };
