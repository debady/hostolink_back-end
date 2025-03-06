
import { IsString, IsOptional } from 'class-validator';

export class CreatePublicationDto {
    @IsString()
    titre_publication: string;

    @IsString()
    contenu: string;

    @IsString()
    image?: string; // Image est optionnel

    id_user: number; // Ajoutez cette propriété
}