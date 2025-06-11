import { IsUUID, IsInt, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  id_user: string;

  @IsInt()
  id_user_etablissement_sante: number;

  @IsString()
  qr_code_valeur: string;
}
