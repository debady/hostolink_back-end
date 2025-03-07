import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetEtablissementsProchesDto {
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lat: number; // Latitude de l'utilisateur 📍

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lon: number; // Longitude de l'utilisateur 📍

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsOptional() // Optionnel, par défaut 10 km
  distance?: number = 10;
}
