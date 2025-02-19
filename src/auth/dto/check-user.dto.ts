import { IsString, IsNotEmpty } from 'class-validator';

export class CheckUserDto {
  @IsString()
  @IsNotEmpty()
  identifier: string; // Peut être un numéro de téléphone ou un email
}
