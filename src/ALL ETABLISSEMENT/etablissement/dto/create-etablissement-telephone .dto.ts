import { IsString, IsInt, IsNotEmpty, IsPhoneNumber } from 'class-validator';  // Utilise class-validator pour la validation

export class CreateEtablissementTelephoneDto {

  @IsPhoneNumber('CI', { message: 'Le numéro de téléphone doit être valide.' })  // CI pour la Côte d'Ivoire
  numero: string;

  @IsInt()
  @IsNotEmpty()
  id_etablissement: number;  // ID de l'établissement auquel appartient ce téléphone
}
