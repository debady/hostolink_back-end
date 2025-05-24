import { IsOptional, IsString } from 'class-validator';

export class TerminerAppelDto {
  @IsOptional()
  @IsString()
  compte_rendu: string | null
}

