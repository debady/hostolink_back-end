import { IsUUID, IsInt, IsString, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  id_user: string;

  @IsInt()
  id_etablissement: number;

  @IsString()
  qr_code_valeur: string;

  @IsNumber()
  montant: number;
}

