import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'L\'identifiant ne peut pas être vide' })
  @IsString({ message: 'L\'identifiant doit être une chaîne de caractères' })
  @Matches(
    /^(\+?[1-9][0-9]{7,14}|[\w-\.]+@([\w-]+\.)+[\w-]{2,4})$/,
    { message: 'L\'identifiant doit être un email valide ou un numéro de téléphone (8 à 15 chiffres)' }
  )
  identifier: string;

  @IsNotEmpty({ message: 'Le mot de passe ne peut pas être vide' })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @MinLength(4, { message: 'Le mot de passe doit contenir au moins 4 caractères' })
  password: string;
}
