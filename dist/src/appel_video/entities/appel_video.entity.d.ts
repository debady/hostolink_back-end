import { ExpertSante } from 'src/user_etablissement_sante/entities/expert_sante.entity';
import { User } from 'src/utilisateur/entities/user.entity';
export declare class AppelVideo {
    id_appel: string;
    utilisateur: User;
    expert: ExpertSante;
    canal_agora: string;
    token_agora: string;
    status_appel: string;
    date_debut: Date;
    date_fin: Date;
    latitude: number;
    longitude: number;
    compte_rendu: string | null;
}
