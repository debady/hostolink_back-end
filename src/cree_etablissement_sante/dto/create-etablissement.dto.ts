import { IsNotEmpty, IsString, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateEtablissementDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)  // ✅ Ajout d'une contrainte de longueur (3 caractères min)
  nom_etablissement_sante: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)  // ✅ Ajout d'une contrainte de longueur pour l'adresse
  adresse_etablissement_sante: string;

  @IsOptional()
  @IsEmail()
  email_etablissement_sante?: string; // Email facultatif

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)  // ✅ La contrainte de longueur pour le téléphone est correcte
  telephone_principal: string; 

  @IsNotEmpty()
  @IsString()
  @Length(6, 255)  // ✅ La contrainte de longueur pour le mot de passe est correcte
  mdp: string;
}
