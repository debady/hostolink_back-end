import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AdministrateurService } from '../administrateur/administrateur.service';
declare const JwtAdminStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtAdminStrategy extends JwtAdminStrategy_base {
    private readonly adminService;
    private readonly configService;
    constructor(adminService: AdministrateurService, configService: ConfigService);
    validate(payload: {
        id: number;
    }): Promise<{
        avatar_url: string | null;
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
        liste_numero_vert: import("../liste_etablissement/entities/liste_numero_vert_etablissement_sante.entity").ListeNumeroEtablissementSante[];
        annonces: import("../annonce/entities/annonce.entity").Annonce[];
        thematiques_crees: import("../1-Module_reseaux_sociale/thematique_discussion/entities/thematique.entity").Thematique[];
        nom: string;
        prenom: string;
        adresse: string;
        solde_de_rechargement: number;
        cumule_des_transactions: number;
        questions: import("../Discussion_agent_client/questions_predefinies/entities/question-predefinie.entity").QuestionsPredefinies[];
        conversations: import("../Discussion_agent_client/conversations/entities/conversation.entity").Conversation[];
    }>;
}
export {};
