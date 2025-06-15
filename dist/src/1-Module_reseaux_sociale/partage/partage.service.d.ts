import { Repository } from 'typeorm';
import { Partage } from './entities/partage.entity';
import { CreatePartageDto } from './dto/partage.dto';
export declare class PartageService {
    private readonly partageRepository;
    private readonly logger;
    constructor(partageRepository: Repository<Partage>);
    create(createPartageDto: CreatePartageDto): Promise<Partage>;
    private validateSingleAuthor;
    findByPublication(id_publication: number): Promise<Partage[]>;
    findByUser(id_user: string): Promise<Partage[]>;
    findByEtablissement(id_etablissement: number): Promise<Partage[]>;
    findByAdmin(id_admin: number): Promise<Partage[]>;
    findByExpert(id_expert: number): Promise<Partage[]>;
    findByUniqueId(uniqueId: string): Promise<Partage>;
    incrementClics(id_partage: number): Promise<Partage>;
    countByPublication(id_publication: number): Promise<number>;
    getPublicationShareStats(id_publication: number): Promise<any>;
}
