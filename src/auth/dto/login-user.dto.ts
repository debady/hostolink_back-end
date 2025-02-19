import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  identifier: string; // Peut être email ou téléphone

  @IsString()
  @IsNotEmpty()
  mdp: string; // Mot de passe
}
