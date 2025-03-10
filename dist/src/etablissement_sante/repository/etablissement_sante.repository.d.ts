import { Repository, DataSource } from 'typeorm';
import { EtablissementSante } from '../entities/etablissement_sante.entity';
export declare class EtablissementSanteRepository extends Repository<EtablissementSante> {
    private dataSource;
    constructor(dataSource: DataSource);
    findNearby(lat: number, lng: number, distance: number): Promise<EtablissementSante[]>;
    findNearbyByCategory(lat: number, lng: number, distance: number, categorie: string): Promise<EtablissementSante[]>;
    findByName(nom: string): Promise<EtablissementSante[]>;
}
