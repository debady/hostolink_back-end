import { ExpertSante } from 'src/user_etablissement_sante/entities/expert_sante.entity';
export declare class DisponibiliteExpert {
    id_expert: number;
    expert: ExpertSante;
    est_connecte: boolean;
    derniere_connexion: Date;
    zone_couverte: string;
}
