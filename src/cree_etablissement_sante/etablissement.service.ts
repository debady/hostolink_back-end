import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EtablissementSante } from './entities/etablissement_sante.entity';
import { CreateEtablissementDto } from './dto/create-etablissement.dto';



@Injectable()
export class EtablissementService {
  constructor(
    @InjectRepository(EtablissementSante)
    private readonly etablissementRepository: Repository<EtablissementSante>,
  ) {}

  async createEtablissement(createEtablissementDto: CreateEtablissementDto): Promise<EtablissementSante> {
    const etablissement = this.etablissementRepository.create(createEtablissementDto);
    return await this.etablissementRepository.save(etablissement);
  }
}
