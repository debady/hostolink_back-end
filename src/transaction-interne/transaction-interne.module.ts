import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompteModule } from '../compte/compte.module';
import { QrCodeModule } from '../qr-code/qr-code.module';
import { TransactionFrais } from 'src/transaction_frais/entitie/transaction_frais.entity';
import { TransactionInterne } from './entitie/transaction_interne.entity';
import { NotificationModule } from 'src/notification_transaction/notification_transaction.module';
import { TransactionController } from './transaction-interne.controller';
import { TransactionService } from './transaction-interne.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionInterne, TransactionFrais]),
    CompteModule,
    QrCodeModule,
    forwardRef(() => NotificationModule), // Pour éviter la dépendance circulaire
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService]
})
export class TransactionModule {}