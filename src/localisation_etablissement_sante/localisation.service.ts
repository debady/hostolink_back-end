import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Localisation } from './entities/localisation.entity';
import { CreateLocalisationDto } from './dto/create-localisation.dto';


@Injectable()
export class LocalisationService {
  constructor(
    @InjectRepository(Localisation)
    private readonly localisationRepository: Repository<Localisation>,
  ) {}

  async createLocalisation(dto: CreateLocalisationDto): Promise<Localisation> {
    const localisation = this.localisationRepository.create(dto);
    return await this.localisationRepository.save(localisation);
  }

  async getAllLocalisations(): Promise<Localisation[]> {
    return await this.localisationRepository.find();
  }
}
