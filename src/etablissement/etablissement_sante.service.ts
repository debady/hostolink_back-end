import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Etablissement } from './entities/etablissement_sante.entity';


@Injectable()
export class EtablissementService {
  constructor(
    @InjectRepository(Etablissement)
    private etablissementRepository: Repository<Etablissement>,
  ) {}

  /**
   * Récupérer les établissements de santé proches d'un utilisateur
   */
  async getEtablissementsProches(lat: number, lon: number, distanceKm: number = 10) {
    return this.etablissementRepository.query(
      `SELECT id_etablissement, nom, categorie_etablissement, telephone, 
              ST_Y(position) AS latitude, 
              ST_X(position) AS longitude,
              adresse,
              ST_Distance(position, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS distance_km
       FROM etablissement_sante
       WHERE ST_DWithin(position, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3 * 1000)
       ORDER BY distance_km;`, 
      [lon, lat, distanceKm]  // ⚠️ L'ordre est (lon, lat, distanceKm)
    );
  }

  /**
   * Rechercher des établissements par leur nom (recherche partielle)
   */
  async searchEtablissements(nom: string) {
    return this.etablissementRepository.find({
      where: { nom: ILike(`%${nom}%`) }, // Recherche insensible à la casse
      select: ['id_etablissement', 'nom', 'categorie_etablissement', 'telephone', 'adresse'],
      take: 10 // Limite les résultats à 10 établissements
    });
  }


  /**
   * Récupérer l'itinéraire entre un utilisateur et un établissement
   */
  async getItineraire(lat: number, lon: number, id_etablissement: number) {
    const etablissement = await this.etablissementRepository
        .createQueryBuilder("etablissement")
        .select(["id_etablissement", "nom", "ST_AsText(position) AS position"])
        .where("id_etablissement = :id", { id: id_etablissement })
        .getRawOne();

    if (!etablissement) {
        throw new NotFoundException('Établissement non trouvé');
    }

    // Vérifier si la position est bien récupérée
    console.log("Position de l'établissement :", etablissement.position);

    // Extraction des coordonnées
    const positionMatch = etablissement.position.match(/POINT\(([^ ]+) ([^)]+)\)/);
    if (!positionMatch) {
        throw new NotFoundException('Coordonnées de l’établissement invalides');
    }

    const etabLon = parseFloat(positionMatch[1]);
    const etabLat = parseFloat(positionMatch[2]);

    // Vérifier si les coordonnées sont correctes
    console.log(`Utilisateur: lat=${lat}, lon=${lon}`);
    console.log(`Établissement: lat=${etabLat}, lon=${etabLon}`);

    // Construire l'URL pour Google Maps API
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${lat},${lon}&destination=${etabLat},${etabLon}&key=GOOGLE_MAPS_API_KEY`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Vérifier la réponse de Google Maps
        console.log("Réponse Google Maps:", data);

        if (data.status !== 'OK') {
            throw new NotFoundException(`Erreur API Google Maps: ${data.status}`);
        }

        return data.routes[0]; // Retourne l’itinéraire le plus rapide
    } catch (error) {
        throw new NotFoundException('Erreur lors de la récupération de l’itinéraire');
    }
}

}
