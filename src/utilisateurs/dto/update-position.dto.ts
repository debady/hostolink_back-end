import { IsNumber } from 'class-validator';

export class UpdatePositionDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;
}
