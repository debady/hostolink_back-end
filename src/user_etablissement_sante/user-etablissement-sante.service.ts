import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserEtablissementDto } from './dto/create-user-etablissement.dto';
import { UserEtablissementSante } from './entities/user-etablissement-sante.entity';

@Injectable()
export class UserEtablissementSanteService {
  constructor(
    @InjectRepository(UserEtablissementSante)
    private readonly repo: Repository<UserEtablissementSante>,
  ) {}

  async create(dto: CreateUserEtablissementDto): Promise<UserEtablissementSante> {
    const nouvelEtablissement = this.repo.create(dto);
    return await this.repo.save(nouvelEtablissement);
  }

  async findAll(): Promise<UserEtablissementSante[]> {
    return this.repo.find();
  }

  // async findById(id: number): Promise<UserEtablissementSante> {
  //   return this.repo.findOneBy({ id });
  // }
}
