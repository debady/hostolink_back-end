import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class MajDisponibiliteDto {
  @IsBoolean()
  est_connecte: boolean;

  @IsOptional()
  @IsString()
  zone_couverte?: string;
}

