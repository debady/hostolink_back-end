import { IsNotEmpty, IsOptional, IsString, IsDateString, IsUrl } from 'class-validator';

export class CreateAnnonceDto {
  @IsNotEmpty()
  id_admin_gestionnaire: number;

  @IsOptional()
  @IsString()
  titre_annonce: string;

  @IsOptional()
  @IsString()
  description_annonce: string;

  @IsOptional()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsUrl()
  url_images: string;
}
