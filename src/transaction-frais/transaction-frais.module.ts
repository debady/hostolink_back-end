import { Module } from '@nestjs/common';
import { TransactionFraisController } from './transaction-frais.controller';
import { TransactionFraisService } from './transaction-frais.service';

@Module({
  controllers: [TransactionFraisController],
  providers: [TransactionFraisService]
})
export class TransactionFraisModule {}
