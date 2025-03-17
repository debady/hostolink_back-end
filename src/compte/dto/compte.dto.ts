// src/compte/dto/create-compte.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateCompteDto {
  @IsEnum(['utilisateur', 'etablissement'])
  @IsNotEmpty()
  type_user: string;

  @IsString()
  @IsNotEmpty()
  devise: string;

  @IsOptional()
  @IsUUID()
  id_user?: string;

  @IsOptional()
  @IsNumber()
  id_user_etablissement_sante?: number;
}