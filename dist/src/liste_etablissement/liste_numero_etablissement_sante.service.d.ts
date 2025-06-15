import { Repository } from 'typeorm';
import { CreateListeNumeroVertEtablissementSanteDto } from './dto/create-liste-numero-vert-etablissement-sante.dto';
import { ResponseListeNumeroVertEtablissementSanteDto } from './dto/response_liste_numero_vert_etablissement_sante.dto';
import { CloudinaryService } from 'src/upload/cloudinary.service';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
import { UpdateListeNumeroVertEtablissementSanteDto } from './dto/update-liste-numero-vert-etablissement-sante.dto';
import { ListeNumeroEtablissementSante } from './entities/liste_numero_vert_etablissement_sante.entity';
export declare class ListeNumeroEtablissementSanteService {
    private readonly listeNumeroRepo;
    private readonly adminRepo;
    private readonly cloudinaryService;
    constructor(listeNumeroRepo: Repository<ListeNumeroEtablissementSante>, adminRepo: Repository<Administrateur>, cloudinaryService: CloudinaryService);
    create(dto: CreateListeNumeroVertEtablissementSanteDto, file?: Express.Multer.File): Promise<ListeNumeroEtablissementSante>;
    findAll(): Promise<ResponseListeNumeroVertEtablissementSanteDto[]>;
    findOne(id: number): Promise<ResponseListeNumeroVertEtablissementSanteDto>;
    findByCategory(categorie: string): Promise<ResponseListeNumeroVertEtablissementSanteDto[]>;
    update(id: number, dto: UpdateListeNumeroVertEtablissementSanteDto, file?: Express.Multer.File): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
    private mapToResponseDto;
}
