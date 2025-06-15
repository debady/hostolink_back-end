import { CompteService } from './compte.service';
export declare class CompteController {
    private readonly compteService;
    constructor(compteService: CompteService);
    getUserCompte(id: string): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        success: boolean;
        data: import("./entitie/compte.entity").Compte;
        message?: undefined;
    }>;
}
