import { IsNotEmpty, IsString, IsUUID, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateWaveSessionDto {
  @IsUUID()
  @IsNotEmpty()
  idUser: string;

  @IsNumber()
  @Min(100) // minimum 100 FCFA par exemple
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  clientReference?: string;

  @IsNotEmpty()
  @IsString()
  successUrl: string;

  @IsNotEmpty()
  @IsString()
  errorUrl: string;
}
