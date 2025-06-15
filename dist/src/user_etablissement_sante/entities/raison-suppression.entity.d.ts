import { UserEtablissementSante } from './user-etablissement-sante.entity';
export declare class RaisonSuppressionCompte {
    id: number;
    raison: string;
    date_suppression: Date;
    userEtablissementSante: UserEtablissementSante;
}
