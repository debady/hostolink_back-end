import { IsOptional, IsString, IsEmail, IsUUID } from 'class-validator';

export class UpdateProfileDto {
  @IsUUID()
  id_user: string;

  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  prenom?: string;

  @IsOptional()
  @IsString()
  pays?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  photo_profile?: string;
}
