// src/transaction/dto/create-transaction-frais.dto.ts
import { IsNumber, IsEnum } from 'class-validator';
import { ModePaiement, TypeTransactionFrais } from '../entite/transaction-frais.entity';

export class CreateTransactionFraisDto {
  @IsNumber()
  id_transaction: number;

  @IsNumber()
  montant_frais: number;

  @IsEnum(TypeTransactionFrais)
  type_transaction: TypeTransactionFrais;

  @IsEnum(ModePaiement)
  mode_paiement: ModePaiement;
}