import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginAdministrateurDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  mot_de_passe: string;
}
