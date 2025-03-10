import { EtablissementSanteService } from './etablissement_sante.service';
import { EtablissementSante } from './entities/etablissement_sante.entity';
import { FindNearbyDto } from './dto/etablissement_sante.dto';
import { UpdateEtablissementDto } from './dto/update-etablissement.dto';
export declare class EtablissementSanteController {
    private readonly etablissementSanteService;
    constructor(etablissementSanteService: EtablissementSanteService);
    create(data: Partial<EtablissementSante>): Promise<EtablissementSante>;
    findAll(): Promise<EtablissementSante[]>;
    findNearby(query: FindNearbyDto): Promise<EtablissementSante[]>;
    findNearbyByCategory(findNearbyDto: FindNearbyDto, categorie: string): Promise<EtablissementSante[]>;
    findByName(nom: string): Promise<EtablissementSante[]>;
    update(id: number, updateData: UpdateEtablissementDto): Promise<EtablissementSante>;
    remove(id: number): Promise<{
        message: string;
    }>;
    findOne(id: number): Promise<EtablissementSante | null>;
}
