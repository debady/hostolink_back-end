import { DataSource, Repository } from 'typeorm';
import { CreateExpertSanteDto } from './dto/create-expert.dto';
import { JwtService } from '@nestjs/jwt';
import { ExpertSante } from './entities/expert_sante.entity';
export declare class ExpertSanteService {
    private readonly expertSanteRepository;
    private readonly jwtService;
    private readonly dataSource;
    constructor(expertSanteRepository: Repository<ExpertSante>, jwtService: JwtService, dataSource: DataSource);
    private genererIdentifiantAleatoire;
    creerExpert(dto: CreateExpertSanteDto, idEtab: number): Promise<{
        message: string;
        identifiant: string;
    }>;
    loginExpert(identifiant: string, motDePasse: string): Promise<{
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
    updatePasswordExpert(identifiant: string, ancien: string, nouveau: string): Promise<{
        message: string;
    }>;
    getExpertById(id: number): Promise<{
        id: number;
        nom: string;
        prenom: string;
        domaine_expertise: string;
        identifiant: string;
        url_profile: string;
    }>;
    getExpertsByEtablissement(idEtab: number): Promise<{
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
    deleteExpertByEtablissement(idExpert: number, idEtab: number): Promise<{
        message: string;
    }>;
    updateAvatar(file: Express.Multer.File, idExpert: number): Promise<{
        message: string;
        url: string;
    }>;
    private extractPublicIdFromUrl;
}
