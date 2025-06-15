import { Repository } from 'typeorm';
import { CreateAppelDto } from './dto/create-appel.dto';
import { AppelVideo } from './entities/appel_video.entity';
import { ExpertSante } from 'src/user_etablissement_sante/entities/expert_sante.entity';
import { User } from 'src/utilisateur/entities/user.entity';
import { TerminerAppelDto } from './dto/terminer-appel.dto';
import { DisponibiliteExpert } from './entities/disponibilite_expert.entity';
import { UpdateAppelStatusDto } from './dto/update-appel-video.dto';
import { MajDisponibiliteDto } from './dto/disponibilite-expert.dto';
import { RefusAppelDto } from './dto/refuse-appel_video.dto';
export declare class AppelVideoService {
    private readonly appelRepo;
    private readonly userRepo;
    private readonly dispoRepo;
    private readonly expertRepo;
    constructor(appelRepo: Repository<AppelVideo>, userRepo: Repository<User>, dispoRepo: Repository<DisponibiliteExpert>, expertRepo: Repository<ExpertSante>);
    private genererTokenAgora;
    lancerAppel(dto: CreateAppelDto): Promise<AppelVideo>;
    terminerAppel(id_appel: string, dto: TerminerAppelDto): Promise<{
        message: string;
        appel: AppelVideo;
    }>;
    verifierAppelActif(id_user: string): Promise<{
        actif: boolean;
        message: string;
        appel?: undefined;
    } | {
        actif: boolean;
        appel: AppelVideo;
        message?: undefined;
    }>;
    historiqueAppels(id_user: string): Promise<{
        total: number;
        appels: AppelVideo[];
    }>;
    changerStatusAppel(id_appel: string, dto: UpdateAppelStatusDto): Promise<AppelVideo>;
    annulerAppel(id_appel: string): Promise<{
        message: string;
    }>;
    mettreAJourDisponibilite(id_expert: number, dto: MajDisponibiliteDto): Promise<DisponibiliteExpert>;
    listerExpertsDisponibles(): Promise<DisponibiliteExpert[]>;
    appelsEnAttentePourExpert(id_expert: number): Promise<AppelVideo[]>;
    accepterAppel(id_appel: string): Promise<{
        message: string;
        appel: AppelVideo;
    }>;
    terminerAppelParExpert(id_appel: string, dto: TerminerAppelDto): Promise<{
        message: string;
        appel: AppelVideo;
    }>;
    historiqueAppelsExpert(id_expert: number): Promise<{
        total: number;
        appels: AppelVideo[];
    }>;
    refuserAppel(id_appel: string, dto: RefusAppelDto): Promise<{
        message: string;
        appel: AppelVideo;
    }>;
    verifierAppelEnCoursPourExpert(id_expert: number): Promise<{
        en_cours: boolean;
        message: string;
        appel?: undefined;
    } | {
        en_cours: boolean;
        appel: {
            id_appel: string;
            canal_agora: string;
            token_agora: string;
            date_debut: Date;
            utilisateur: {
                id_user: string;
                nom: string | undefined;
                prenom: string | undefined;
            };
        };
        message?: undefined;
    }>;
}
