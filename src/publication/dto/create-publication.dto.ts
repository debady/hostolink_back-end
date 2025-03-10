
// import { IsString, IsOptional } from 'class-validator';

// export class CreatePublicationDto {
//     @IsString()
//     titre_publication: string;

//     @IsString()
//     contenu: string;

//     @IsString()
//     image?: string; // Image est optionnel

//     id_user: number; // Ajoutez cette propriété
// }

import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class CreatePublicationDto {
    @IsString()
    @IsNotEmpty()
    titre_publication: string;

    @IsString()
    @IsNotEmpty()
    contenu: string;

    @IsOptional()
    @IsString()
    image?: string; // Image est optionnel

    @IsInt()
    @IsNotEmpty()
    id_user: number; // Correction ici
}
