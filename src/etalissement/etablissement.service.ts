 
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Etablissement } from './entities/etablissement.entity';

@Injectable()
export class EtablissementService {
  constructor(
    @InjectRepository(Etablissement)
    private readonly etablissementRepository: Repository<Etablissement>,
  ) {}

  async getAll(): Promise<Etablissement[]> {
    return this.etablissementRepository.find();
  }

  async getNearbyEtablissements(lat: number, lon: number, radius: number): Promise<Etablissement[]> {
    return this.etablissementRepository.query(
      `SELECT id, nom, type, ST_Distance(localisation, ST_GeogFromText('SRID=4326;POINT(${lon} ${lat})')) AS distance
       FROM etablissement
       WHERE ST_DWithin(localisation, ST_GeogFromText('SRID=4326;POINT(${lon} ${lat})'), $1)
       ORDER BY distance;`, 
      [radius]
    );
  }
}
