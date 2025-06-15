import { AppelVideoService } from './appel_video.service';
import { CreateAppelDto } from './dto/create-appel.dto';
import { AppelVideo } from './entities/appel_video.entity';
import { TerminerAppelDto } from './dto/terminer-appel.dto';
import { UpdateAppelStatusDto } from './dto/update-appel-video.dto';
import { MajDisponibiliteDto } from './dto/disponibilite-expert.dto';
import { RefusAppelDto } from './dto/refuse-appel_video.dto';
export declare class AppelVideoController {
    private readonly appelService;
    constructor(appelService: AppelVideoService);
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
    changerStatus(id_appel: string, dto: UpdateAppelStatusDto): Promise<AppelVideo>;
    annulerAppel(id_appel: string): Promise<{
        message: string;
    }>;
    mettreAJourDispo(id_expert: number, dto: MajDisponibiliteDto): Promise<import("./entities/disponibilite_expert.entity").DisponibiliteExpert>;
    listerExpertsConnectes(): Promise<import("./entities/disponibilite_expert.entity").DisponibiliteExpert[]>;
    getAppelsEnAttente(id_expert: number): Promise<AppelVideo[]>;
    accepterAppel(id_appel: string): Promise<{
        message: string;
        appel: AppelVideo;
    }>;
    terminerParExpert(id_appel: string, dto: TerminerAppelDto): Promise<{
        message: string;
        appel: AppelVideo;
    }>;
    getHistoriqueExpert(id_expert: number): Promise<{
        total: number;
        appels: AppelVideo[];
    }>;
    refuserAppel(id_appel: string, dto: RefusAppelDto): Promise<{
        message: string;
        appel: AppelVideo;
    }>;
    verifierAppelEnCours(id_expert: number): Promise<{
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
