import { IsOptional, IsNumber } from 'class-validator';

export class GetLocalisationDto {
  @IsOptional()
  @IsNumber()
  minLatitude?: number;

  @IsOptional()
  @IsNumber()
  maxLatitude?: number;

  @IsOptional()
  @IsNumber()
  minLongitude?: number;

  @IsOptional()
  @IsNumber()
  maxLongitude?: number;
}
