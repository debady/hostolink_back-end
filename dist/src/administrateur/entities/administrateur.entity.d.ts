import { Annonce } from 'src/annonce/entities/annonce.entity';
import { Conversation } from 'src/Discussion_agent_client/conversations/entities/conversation.entity';
import { QuestionsPredefinies } from 'src/Discussion_agent_client/questions_predefinies/entities/question-predefinie.entity';
import { ListeNumeroEtablissementSante } from 'src/liste_etablissement/entities/liste_numero_vert_etablissement_sante.entity';
import { Thematique } from 'src/1-Module_reseaux_sociale/thematique_discussion/entities/thematique.entity';
export declare class Administrateur {
    id_admin_gestionnaire: number;
    email: string;
    telephone: string;
    mot_de_passe: string;
    role: string;
    statut: string;
    permissions: object;
    dernier_connexion: Date;
    date_creation: Date;
    date_modification: Date;
    liste_numero_vert: ListeNumeroEtablissementSante[];
    annonces: Annonce[];
    thematiques_crees: Thematique[];
    nom: string;
    prenom: string;
    adresse: string;
    solde_de_rechargement: number;
    cumule_des_transactions: number;
    questions: QuestionsPredefinies[];
    conversations: Conversation[];
}
