import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateLocalisationDto {
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
