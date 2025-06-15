import { User } from 'src/utilisateur/entities/user.entity';
import { Thematique } from './thematique.entity';
import { ExpertSante } from 'src/user_etablissement_sante/entities/expert_sante.entity';
export declare class MessageThematique {
    id_message: number;
    thematique: Thematique;
    expediteur: User;
    contenu: string;
    type_message: string;
    date_envoi: Date;
    est_lu: boolean;
    url_image?: string;
    nbre_like: number;
    status_reponse: boolean;
    expert?: ExpertSante;
}
