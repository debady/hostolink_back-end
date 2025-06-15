import { ListeNumeroEtablissementSanteService } from './liste_numero_etablissement_sante.service';
import { CreateListeNumeroVertEtablissementSanteDto } from './dto/create-liste-numero-vert-etablissement-sante.dto';
import { ResponseListeNumeroVertEtablissementSanteDto } from './dto/response_liste_numero_vert_etablissement_sante.dto';
import { CloudinaryService } from 'src/upload/cloudinary.service';
import { UpdateListeNumeroVertEtablissementSanteDto } from './dto/update-liste-numero-vert-etablissement-sante.dto';
export declare class ListeNumeroEtablissementSanteController {
    private readonly listeService;
    private readonly cloudinaryService;
    constructor(listeService: ListeNumeroEtablissementSanteService, cloudinaryService: CloudinaryService);
    create(file: Express.Multer.File, dto: CreateListeNumeroVertEtablissementSanteDto): Promise<import("./entities/liste_numero_vert_etablissement_sante.entity").ListeNumeroEtablissementSante>;
    findAll(): Promise<ResponseListeNumeroVertEtablissementSanteDto[]>;
    findByCategory(categorie: string): Promise<ResponseListeNumeroVertEtablissementSanteDto[]>;
    findOne(id: number): Promise<ResponseListeNumeroVertEtablissementSanteDto>;
    update(id: number, file: Express.Multer.File, dto: UpdateListeNumeroVertEtablissementSanteDto): Promise<{
        message: string;
        id: number;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
