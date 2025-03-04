 
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SearchEtablissementDto {
  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @IsNotEmpty()
  @IsNumber()
  lon: number;

  @IsNotEmpty()
  @IsNumber()
  radius: number;
}
