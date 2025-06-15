import { PartageService } from './partage.service';
import { Partage } from './entities/partage.entity';
import { CreatePartageDto } from './dto/partage.dto';
export declare class PartageController {
    private readonly partageService;
    constructor(partageService: PartageService);
    create(createPartageDto: CreatePartageDto): Promise<Partage>;
    findByPublication(id_publication: number): Promise<Partage[]>;
    findByUser(id_user: string): Promise<Partage[]>;
    findByEtablissement(id_etablissement: number): Promise<Partage[]>;
    findByAdmin(id_admin: number): Promise<Partage[]>;
    findByExpert(id_expert: number): Promise<Partage[]>;
    getSharedPublication(uniqueId: string): Promise<{
        partage: Partage;
        publication: import("../publication/entities/publication.entity").Publication;
    }>;
    countByPublication(id_publication: number): Promise<{
        count: number;
    }>;
    getPublicationShareStats(id_publication: number): Promise<any>;
}
