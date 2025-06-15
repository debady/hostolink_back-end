import { MessageThematique } from './message_thematique.entity';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
export declare class Thematique {
    id_thematique_discussion: number;
    administrateur: Administrateur;
    titre_thematique: string;
    sous_titre: string;
    image: string;
    description: string;
    nbre_expert: number;
    date_ajout: Date;
    messages: MessageThematique[];
}
