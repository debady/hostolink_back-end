import { Repository } from 'typeorm';
import { Administrateur } from './entities/administrateur.entity';
import { CreateAdministrateurDto } from './dto/create-administrateur.dto';
import { LoginAdministrateurDto } from './dto/login-administrateur.dto';
import { JwtService } from '@nestjs/jwt';
import { Image } from '../image/entities/image.entity';
import { v2 as cloudinary } from 'cloudinary';
import { DataSource } from 'typeorm';
export declare class AdministrateurService {
    private readonly adminRepository;
    private readonly jwtService;
    private cloudinaryProvider;
    private readonly imageRepository;
    private readonly dataSource;
    constructor(adminRepository: Repository<Administrateur>, jwtService: JwtService, cloudinaryProvider: typeof cloudinary, imageRepository: Repository<Image>, dataSource: DataSource);
    inscrireAdministrateur(dto: CreateAdministrateurDto): Promise<{
        message: string;
        administrateur: {
            id: number;
            email: string;
            telephone: string;
            role: string;
        };
    }>;
    connexionAdministrateur(dto: LoginAdministrateurDto): Promise<{
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
    getAdminById(id: number): Promise<{
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
    uploadAvatarAdmin(id: number, avatar: Express.Multer.File): Promise<{
        message: string;
        url_image: string;
    }>;
    supprimerAdministrateur(id: number): Promise<{
        message: string;
    }>;
    modifierStatutAdministrateur(id: number, statut: string): Promise<{
        message: string;
    }>;
    modifierAdministrateur(id: number, dto: Partial<CreateAdministrateurDto>): Promise<{
        message: string;
        admin: Administrateur;
    }>;
    recupererTousLesAdmins(): Promise<{
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
    modifierMotDePasseAdmin(id: number, nouveauMotDePasse: string): Promise<{
        message: string;
    }>;
    modifierPermissionsAdmin(id: number, permissions: Record<string, any>): Promise<{
        message: string;
        permissions: Record<string, any>;
    }>;
    rechercherParRole(role: string): Promise<{
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
    crediterUtilisateur(id_user: string, montant: number, idAdmin: number): Promise<{
        message: string;
        utilisateur: string;
        montant_crédité: number;
    }>;
    crediterEtablissement(idEtab: number, montant: number, idAdmin: number): Promise<{
        message: string;
        nouveauSolde: null;
        montant_crédité: number;
    }>;
    retirerUtilisateur(id_user: string, montant: number, idAdmin: number): Promise<{
        message: string;
        utilisateur: string;
        montant_retiré: number;
    }>;
    retirerEtablissement(idEtab: number, montant: number, idAdmin: number): Promise<{
        message: string;
        nouveauSolde: number;
        montant_retiré: number;
    }>;
    findAllEtablissements(): Promise<{
        total: number;
        etablissements: any[];
    }>;
    rechargerUser(identifiant: string, montant: number, idAdmin: number): Promise<{
        message: string;
        nouveauSolde: number | null;
        montant_crédité: number;
    }>;
    rechargerEtablissement(identifiant: string, montant: number, idAdmin: number): Promise<{
        message: string;
        nouveauSolde: number | null;
        montant_crédité: number;
    }>;
    getAllRechargements(): Promise<any>;
    getTotalFraisTransactions(): Promise<{
        total_frais: number;
    }>;
    findUser(identifiant: string, type: string): Promise<{
        utilisateur: {
            id: any;
            email: any;
            telephone: any;
            nom: any;
            image_profil: any;
            actif: boolean;
            date_inscription: any;
        };
    }>;
    rechercherUtilisateurParIdentifiant(identifiant: string, type: string): Promise<any>;
    verifierEtMettreAJourAdminTransaction(idAdmin: number, montant: number): Promise<void>;
}
