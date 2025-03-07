import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Utilisateur } from './entities/utilisateur.entity';


@Injectable()
export class UtilisateurService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
  ) {}

  async mettreAJourPosition(id_user: number, lat: number, lon: number) {
    const positionGeometrique = `SRID=4326;POINT(${lon} ${lat})`;
  
    return this.utilisateurRepository.query(
      `UPDATE utilisateur 
       SET position = ST_GeomFromText($1, 4326)
       WHERE id_user = $2`,
      [positionGeometrique, id_user]
    );
  }
  
}
