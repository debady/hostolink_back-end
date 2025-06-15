import { Point } from 'geojson';
export declare class EtablissementSante {
    id: number;
    nom: string;
    telephone: string;
    categorie: string;
    adresse: string;
    createdAt: Date;
    latitude: number;
    longitude: number;
    geom: Point;
}
