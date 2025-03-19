import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateAdministrateurDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  mot_de_passe: string;

  @IsString()
  @IsNotEmpty()
  role: string;

}
