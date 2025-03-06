import { IsOptional, IsNumber } from 'class-validator';

export class UpdateLocalisationDto {
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  rayon?: number;
}
