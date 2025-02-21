import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CheckUserDto {
  @IsNotEmpty({ message: 'L\'identifiant ne peut pas être vide' })
  @IsString({ message: 'L\'identifiant doit être une chaîne de caractères' })
  @Matches(
    /^(?:\d{8,15}|[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,})$/,
    { message: 'L\'identifiant doit être un email valide ou un numéro de téléphone (8 à 15 chiffres)' }
  )
  identifier: string; // Peut être un email ou un numéro de téléphone
}
