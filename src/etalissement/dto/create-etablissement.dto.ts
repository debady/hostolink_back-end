 
import { IsNotEmpty, IsString, IsOptional, Matches } from 'class-validator';

export class CreateEtablissementDto {
  @IsNotEmpty()
  @IsString()
  nom: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsNotEmpty()
  @IsString()
  type: string; // 'hopital', 'clinique', 'pharmacie'

  @IsOptional()
  @Matches(/^\d{8,15}$/, { message: 'Numéro de téléphone invalide' })
  telephone?: string;

  @IsNotEmpty()
  @IsString()
  localisation: string; // Format "SRID=4326;POINT(-3.9750 5.3450)"
}
