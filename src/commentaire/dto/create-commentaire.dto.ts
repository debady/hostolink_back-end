import { IsString, IsInt, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentaireDto {
  @IsString()
  @IsNotEmpty()
  contenu: string;

  @IsOptional()
  @IsInt()
  id_publication?: number;

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