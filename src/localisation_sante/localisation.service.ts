import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateLocalisationDto } from './dto/update-localisation.dto';
import { Localisation } from './entities/localisation.entity';
import { GetLocalisationDto } from './dto/get-localisation.dto';
import { CreateLocalisationDto } from 'src/localisation_etablissement_sante/dto/create-localisation.dto';


@Injectable()
export class LocalisationService {
  getAllLocalisations() {
    throw new Error('Method not implemented.');
  }
  createLocalisation(createLocalisationDto: CreateLocalisationDto) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Localisation)
    private localisationRepository: Repository<Localisation>,
  ) {}

  // ✅ Récupérer toutes les localisations existantes
  async findAll(): Promise<Localisation[]> {
    return this.localisationRepository.find();
  }

  // ✅ Récupérer une localisation spécifique par ID
  async findOne(id: number): Promise<Localisation> {
    const localisation = await this.localisationRepository.findOne({
      where: { id_localisation: id },
    });
    if (!localisation) {
      throw new NotFoundException(`Localisation avec ID ${id} introuvable.`);
    }
    return localisation;
  }

  // ✅ Modifier une localisation existante
  async update(id: number, dto: UpdateLocalisationDto): Promise<Localisation> {
    const localisation = await this.findOne(id);
    Object.assign(localisation, dto);
    return this.localisationRepository.save(localisation);
  }

  // ✅ Rechercher des localisations selon des filtres (min/max latitude & longitude)
  async findWithFilters(dto: GetLocalisationDto): Promise<Localisation[]> {
    const query = this.localisationRepository.createQueryBuilder('localisation');

    if (dto.minLatitude) {
      query.andWhere('localisation.latitude >= :minLatitude', {
        minLatitude: dto.minLatitude,
      });
    }
    if (dto.maxLatitude) {
      query.andWhere('localisation.latitude <= :maxLatitude', {
        maxLatitude: dto.maxLatitude,
      });
    }
    if (dto.minLongitude) {
      query.andWhere('localisation.longitude >= :minLongitude', {
        minLongitude: dto.minLongitude,
      });
    }
    if (dto.maxLongitude) {
      query.andWhere('localisation.longitude <= :maxLongitude', {
        maxLongitude: dto.maxLongitude,
      });
    }

    return query.getMany();
  }
}
