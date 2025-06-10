// // import { IsString, IsOptional, IsNotEmpty, IsUUID, IsInt } from 'class-validator';

// // export class CreatePublicationDto {
// //   @IsString()
// //   @IsNotEmpty()
// //   titre_publication: string;

// //   @IsString()
// //   @IsNotEmpty()
// //   contenu: string;

// //   @IsOptional()
// //   @IsString()
// //   image?: string;

// //   // UN SEUL de ces champs doit être fourni
// //   @IsOptional()
// //   @IsUUID()
// //   id_user?: string;

// //   @IsOptional()
// //   @IsInt()
// //   id_user_etablissement_sante?: number;

// //   @IsOptional()
// //   @IsInt()
// //   id_admin_gestionnaire?: number;

// //   @IsOptional()
// //   @IsInt()
// //   id_expert?: number;
// // }



// // import { IsOptional, IsString, IsNumber, IsUUID, IsInt } from 'class-validator';

// // export class CreatePublicationDto {
// //   @IsString()
// //   titre_publication: string;

// //   @IsString()
// //   contenu: string;

// //   @IsOptional()
// //   @IsString()
// //   image?: string;

// //   @IsOptional()
// //   @IsUUID()
// //   id_user?: string;

// //   @IsOptional()
// //   @IsInt()
// //   id_user_etablissement_sante?: number;

// //   @IsOptional()
// //   @IsInt()
// //   id_admin_gestionnaire?: number;

// //   @IsOptional()
// //   @IsInt()
// //   id_expert?: number;
// // }



import { IsString, IsOptional } from 'class-validator';

export class CreatePublicationDto {
  @IsString()
  titre_publication: string;

  @IsString()
  contenu: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  id_user?: string;

  @IsOptional()
  id_user_etablissement_sante?: number;

  @IsOptional()
  id_admin_gestionnaire?: number;

  @IsOptional()
  id_expert?: number;
}
