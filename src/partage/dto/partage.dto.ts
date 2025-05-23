import { IsInt, IsOptional, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePartageDto {
  @IsInt()
  @IsNotEmpty()
  id_publication: number;

  @IsOptional()
  @IsString()
  plateforme_partage?: string;

  // UN SEUL de ces champs doit être fourni
  @IsOptional()
  @IsUUID()
  id_user?: string;

  @IsOptional()
  @IsInt()
  id_user_etablissement_sante?: number;

  @IsOptional()
  @IsInt()
  id_admin_gestionnaire?: number;

  @IsOptional()
  @IsInt()
  id_expert?: number;
}