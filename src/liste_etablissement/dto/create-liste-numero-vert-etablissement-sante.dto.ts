import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, IsEnum } from 'class-validator';
import { TypeEtablissementEnum } from '../entities/liste_numero_vert_etablissement_sante.entity';

export class CreateListeNumeroVertEtablissementSanteDto {
  @IsInt()
  @Type(() => Number) 
  id_admin_gestionnaire?: number;

  @IsNotEmpty()
  @IsString()
  contact: string;

  @IsOptional()
  @IsString()
  image?: string; // ✅ Image doit être une chaîne

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
  @IsEnum(TypeEtablissementEnum, { message: "Le type d'établissement doit être 'hopital', 'clinique' ou 'pharmacie'" })
  type_etablissement: TypeEtablissementEnum;
  
  @IsNotEmpty()
  @IsString()
  categorie: string;

}
