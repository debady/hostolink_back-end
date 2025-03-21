// src/transaction/dto/pay-with-qr.dto.ts
import { IsString, IsNumber, Min } from 'class-validator';

export class PayWithQrDto {
  @IsString()
  token: string;

  @IsNumber()
  @Min(1)
  montant: number;
}