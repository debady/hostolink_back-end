import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTypeEtablissementDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  nom_etablissement: string; // ✅ Correspondance avec la BD
}
