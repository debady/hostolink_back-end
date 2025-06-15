import { ExpertSanteService } from './expert-sante.service';
import { CreateExpertSanteDto } from './dto/create-expert.dto';
export declare class ExpertSanteController {
    private readonly expertSanteService;
    constructor(expertSanteService: ExpertSanteService);
    createExpert(dto: CreateExpertSanteDto, req: any): Promise<{
        message: string;
        identifiant: string;
    }>;
    loginExpert(body: {
        identifiant: string;
        mot_de_passe: string;
    }): Promise<{
        message: string;
        token: string;
        expert: {
            id: number;
            nom: string;
            prenom: string;
            domaine_expertise: string;
            identifiant: string;
            url_profile: string;
        };
    }>;
    getProfile(req: any): Promise<{
        id: number;
        nom: string;
        prenom: string;
        domaine_expertise: string;
        identifiant: string;
        url_profile: string;
    }>;
    updatePassword(body: {
        identifiant: string;
        ancien_mdp: string;
        nouveau_mdp: string;
    }): Promise<{
        message: string;
    }>;
    getExpertsByEtablissement(req: any): Promise<{
        total: number;
        experts: {
            id: number;
            nom: string;
            prenom: string;
            domaine_expertise: string;
            identifiant: string;
            url_profile: string;
        }[];
    }>;
    deleteExpert(id: number, req: any): Promise<{
        message: string;
    }>;
    updateAvatarExpert(file: Express.Multer.File, req: any): Promise<{
        message: string;
        url: string;
    }>;
}
