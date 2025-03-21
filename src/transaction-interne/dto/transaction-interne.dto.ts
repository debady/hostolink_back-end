// src/transaction/dto/create-transaction.dto.ts
import { IsNumber, IsString, IsEnum, IsOptional, Min } from 'class-validator';
import { TransactionType } from '../entitie/transaction-interne.entity';

export class CreateTransactionDto {
  @IsNumber()
  id_compte_expediteur: number;

  @IsNumber()
  id_compte_recepteur: number;

  @IsNumber()
  @IsOptional()
  id_utilisateur_recepteur?: number;

  @IsNumber()
  @IsOptional()
  id_etablissement_recepteur?: number;

  @IsNumber()
  @Min(1)
  montant: number;

  @IsString()
  @IsOptional()
  devise_transaction?: string = 'XOF';

  @IsEnum(TransactionType)
  @IsOptional()
  type_transaction?: TransactionType = TransactionType.PAIEMENT_QRCODE;

  @IsNumber()
  @IsOptional()
  id_qrcode?: number;

  @IsNumber()
  @IsOptional()
  id_user_etablissement_sante?: number;
}