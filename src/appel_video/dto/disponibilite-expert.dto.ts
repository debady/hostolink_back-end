import { IsBoolean } from 'class-validator';

export class MajDisponibiliteDto {
  @IsBoolean()
  est_connecte: boolean;
}

