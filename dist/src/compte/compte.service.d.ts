import { Repository } from 'typeorm';
import { Compte } from './entitie/compte.entity';
export declare class CompteService {
    private readonly compteRepository;
    constructor(compteRepository: Repository<Compte>);
    createUserCompte(id_user: string): Promise<Compte>;
    getUserCompte(id_user: string): Promise<Compte | null>;
    private generateAccountNumber;
    updateCompteBonus(id_compte: number, nouveauSoldeBonus: number): Promise<void>;
    créditerBonusParrain(id_parrain: string, montant?: number): Promise<void>;
}
