import { Module } from '@nestjs/common';
import { TransactionFraisService } from './transaction_frais.service';
import { TransactionFraisController } from './transaction_frais.controller';

@Module({
  providers: [TransactionFraisService],
  controllers: [TransactionFraisController]
})
export class TransactionFraisModule {}
