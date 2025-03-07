import { IsString, IsNotEmpty } from 'class-validator';

export class SearchEtablissementDto {
  @IsString()
  @IsNotEmpty()
  nom: string; // Nom (ou partie du nom) de l'établissement à rechercher
}
