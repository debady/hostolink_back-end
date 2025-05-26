// src/thematique_discussion/dto/create-thematique.dto.ts
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateThematiqueDto {
  @IsInt()
  @IsNotEmpty()
  id_admin_gestionnaire: number;

  @IsString()
  @IsNotEmpty()
  titre_thematique: string;

  @IsString()
  @IsOptional()
  sous_titre?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsNotEmpty()
  nbre_expert?: number;
}
