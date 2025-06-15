import { Repository } from 'typeorm';
import { EtablissementSante } from './entities/etablissement_sante.entity';
import { EtablissementSanteRepository } from './repository/etablissement_sante.repository';
import { UpdateEtablissementDto } from './dto/update-etablissement.dto';
export declare class EtablissementSanteService {
    private readonly etablissementSanteRepository;
    private readonly etablissementSanteRepo;
    constructor(etablissementSanteRepository: Repository<EtablissementSante>, etablissementSanteRepo: EtablissementSanteRepository);
    createEtablissement(data: Partial<EtablissementSante>): Promise<EtablissementSante>;
    findAll(): Promise<EtablissementSante[]>;
    findOne(id: number): Promise<EtablissementSante>;
    findNearby(lat: number, lng: number, distanceKm: number): Promise<EtablissementSante[]>;
    findNearbyByCategory(lat: number, lng: number, distanceKm: number, categorie: string): Promise<EtablissementSante[]>;
    findByName(nom: string): Promise<EtablissementSante[]>;
    updateEtablissement(id: number, updateData: UpdateEtablissementDto): Promise<EtablissementSante>;
    deleteEtablissement(id: number): Promise<void>;
}
