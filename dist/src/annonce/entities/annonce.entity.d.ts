import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
export declare class Annonce {
    id_annonce: number;
    id_admin_gestionnaire: Administrateur;
    titre_annonce: string;
    description_annonce: string;
    date: Date;
    url_images: string;
}
