import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTypeEtablissementDto } from './dto/create-type-etablissement';
import { TypeEtablissement } from './entities/type-etablissement.entity';


@Injectable()
export class TypeEtablissementService {
  constructor(
    @InjectRepository(TypeEtablissement)
    private readonly typeEtablissementRepository: Repository<TypeEtablissement>,
  ) {}

  async createTypeEtablissement(createTypeDto: CreateTypeEtablissementDto): Promise<TypeEtablissement> {
    const typeEtablissement = this.typeEtablissementRepository.create(createTypeDto);
    return await this.typeEtablissementRepository.save(typeEtablissement);
  }
}
