// dto/update-transaction-status.dto.ts
import { IsEnum } from 'class-validator';
import { TransactionStatus } from '../entitie/transaction-interne.entity';

export class UpdateTransactionStatusDto {
  @IsEnum(TransactionStatus)
  statut: TransactionStatus;
}

