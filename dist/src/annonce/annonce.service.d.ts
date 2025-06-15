import { Repository } from 'typeorm';
import { Annonce } from './entities/annonce.entity';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
import { UpdateAnnonceDto } from './dto/update-annoce.dto';
export declare class AnnonceService {
    private annonceRepository;
    private adminRepository;
    constructor(annonceRepository: Repository<Annonce>, adminRepository: Repository<Administrateur>);
    createAnnonce(dto: CreateAnnonceDto): Promise<Annonce>;
    getAllAnnonces(): Promise<Annonce[]>;
    updateAnnonce(id: number, dto: UpdateAnnonceDto): Promise<Annonce>;
    deleteAnnonce(id: number): Promise<{
        message: string;
    }>;
}
