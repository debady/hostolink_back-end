import { IsOptional, IsString } from 'class-validator';

export class RefusAppelDto {
  @IsOptional()
  @IsString()
  motif?: string;
}

