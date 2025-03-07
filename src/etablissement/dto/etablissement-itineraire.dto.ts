import { Transform } from 'class-transformer';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class ItineraireDto {
  @Transform(({ value }) => parseFloat(value)) // ✅ Transforme la valeur en nombre
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsNotEmpty()
  lon: number;

  @Transform(({ value }) => parseInt(value, 10)) // ✅ Transforme en entier
  @IsNumber()
  @IsNotEmpty()
  id_etablissement: number;
}
