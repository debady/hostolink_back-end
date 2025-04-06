import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateUserEtablissementDto {
  @IsString()
  nom: string;

  @IsString()
  telephone: string;

  @IsString()
  categorie: string;

  @IsString()
  adresse: string;

  @IsOptional()
  latitude?: number;

  @IsOptional()
  longitude?: number;

  @IsOptional()
  specialites?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  mot_de_passe: string;
}
