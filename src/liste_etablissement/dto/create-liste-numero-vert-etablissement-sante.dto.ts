import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt } from 'class-validator';

export class CreateListeNumeroVertEtablissementSanteDto {
  @IsInt()
  @Type(() => Number) 
  id_admin_gestionnaire?: number;

  @IsNotEmpty()
  @IsString()
  contact: string;

  @IsNotEmpty()
  @IsString()
  image: string; // URL de l'image

  @IsOptional()
  @IsString()
  nom_etablissement?: string;

  @IsOptional()
  @IsString()
  presentation?: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;

  @IsOptional()
  @IsString()
  site_web?: string;
  
  @IsNotEmpty() 
  @IsString()
  type_etablissement: string;

}
