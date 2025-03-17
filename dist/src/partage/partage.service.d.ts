import { Repository } from 'typeorm';
import { Partage } from './entities/partage.entity';
import { CreatePartageDto } from './dto/partage.dto';
export declare class PartageService {
    private readonly partageRepository;
    constructor(partageRepository: Repository<Partage>);
    create(createPartageDto: CreatePartageDto): Promise<Partage>;
    incrementClics(id_partage: number): Promise<Partage>;
    findByUniqueId(uniqueId: string): Promise<Partage>;
    findByPublication(id_publication: number): Promise<Partage[]>;
    findByUser(id_user: number): Promise<Partage[]>;
    countByPublication(id_publication: number): Promise<number>;
    getPublicationShareStats(id_publication: number): Promise<any>;
    deletePartagesByPublicationId(id_publication: number): Promise<void>;
}
