import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(4) // Le mot de passe doit contenir au moins 8 caractères
  nouveau_mot_de_passe: string;
}
