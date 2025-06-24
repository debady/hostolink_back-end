import { CreateAdministrateurDto } from './dto/create-administrateur.dto';
import { AdministrateurService } from './administrateur.service';
import { LoginAdministrateurDto } from './dto/login-administrateur.dto';
import { DataSource } from 'typeorm';
export declare class AdministrateurController {
    private readonly administrateurService;
    private readonly adminService;
    private readonly dataSource;
    constructor(administrateurService: AdministrateurService, adminService: AdministrateurService, dataSource: DataSource);
    inscrireAdmin(dto: CreateAdministrateurDto): Promise<{
        message: string;
        administrateur: {
            id: number;
            email: string;
            telephone: string;
            role: string;
        };
    }>;
    login(dto: LoginAdministrateurDto): Promise<{
        message: string;
        administrateur: {
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
        };
        access_token: string;
    }>;
    getMe(req: any): Promise<{
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
    uploadAvatar(id: number, avatar: Express.Multer.File): Promise<{
        message: string;
        url_image: string;
    }>;
    supprimerAdministrateur(id: number): Promise<{
        message: string;
    }>;
    supprimerAdminParSuperAdmin(id: number, req: any): Promise<{
        message: string;
    }>;
    modifierStatutAdmin(id: number, statut: string, req: any): Promise<{
        message: string;
    }>;
    modifierAdministrateur(id: number, dto: Partial<CreateAdministrateurDto>, req: any): Promise<{
        message: string;
        admin: import("./entities/administrateur.entity").Administrateur;
    }>;
    recupererAdmins(req: any): Promise<{
        nombre_admins: number;
        administrateurs: {
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
        }[];
    }>;
    afficherDetailsAdmin(id: number, req: any): Promise<{
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
    modifierMotDePasse(id: number, nouveauMotDePasse: string, req: any): Promise<{
        message: string;
    }>;
    attribuerPermissions(id: number, permissions: Record<string, any>, req: any): Promise<{
        message: string;
        permissions: Record<string, any>;
    }>;
    rechercherAdminParRole(role: string, req: any): Promise<{
        nombre_resultats: number;
        administrateurs: {
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
        }[];
    }>;
    crediterUtilisateur(req: any, body: {
        id_user: string;
        montant: number;
    }): Promise<{
        message: string;
        utilisateur: string;
        montant_crédité: number;
    }>;
    crediterEtablissement(id: number, montant: number, req: any): Promise<{
        message: string;
        nouveauSolde: null;
        montant_crédité: number;
    }>;
    getAllEtablissements(): Promise<{
        total: number;
        etablissements: any[];
    }>;
    rechargerUser(req: any, body: {
        identifiant: string;
        montant: number;
    }): Promise<{
        message: string;
        nouveauSolde: number | null;
        montant_crédité: number;
    }>;
    rechargerEtablissement(req: any, body: {
        identifiant: string;
        montant: number;
    }): Promise<{
        message: string;
        nouveauSolde: number | null;
        montant_crédité: number;
    }>;
    getAllRechargements(): Promise<any>;
    getTotalFraisTransactions(): Promise<{
        total_frais: number;
    }>;
    findUser(req: any, identifiant: string, type: string): Promise<any>;
    verifierTokenDynamique(token: string): Promise<{
        id_user: any;
    }>;
    verifierTokenStatique(token: string): Promise<{
        id_user: any;
    }>;
    retirerUser(req: any, body: {
        identifiant: string;
        montant: number;
    }): Promise<{
        message: string;
        utilisateur: string;
        montant_retiré: number;
    }>;
    retirerEtablissement(req: any, body: {
        identifiant: string;
        montant: number;
    }): Promise<{
        message: string;
        nouveauSolde: number;
        montant_retiré: number;
    }>;
}
