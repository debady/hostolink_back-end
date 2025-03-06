import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEtablissementTelephoneDto } from './create-etablissement-telephone .dto';
import { EtablissementSante } from './entities/etablissement_sante.entity';
import { EtablissementTelephone } from './entities/etablissement_telephone.entity';


@Injectable()
export class EtablissementTelephoneService {
  constructor(
    @InjectRepository(EtablissementTelephone)
    private readonly etablissementTelephoneRepository: Repository<EtablissementTelephone>,

    @InjectRepository(EtablissementSante)
    private readonly etablissementRepository: Repository<EtablissementSante>,
  ) {}

  async createEtablissementTelephone(
    createEtablissementTelephoneDto: CreateEtablissementTelephoneDto,
  ): Promise<EtablissementTelephone> {
    // Recherche de l'établissement à partir de l'ID
    const etablissement = await this.etablissementRepository.findOne({
      where: { id_etablissement: createEtablissementTelephoneDto.id_etablissement },
    });

    if (!etablissement) {
      throw new Error('Établissement introuvable');
    }

    // Crée un nouveau téléphone et l'associe à l'établissement
    const telephone = this.etablissementTelephoneRepository.create({
      numero: createEtablissementTelephoneDto.numero,
      etablissement: etablissement,
    });

    // Sauvegarde le téléphone dans la base de données
    return this.etablissementTelephoneRepository.save(telephone);
  }

  // Méthode pour obtenir tous les téléphones
  async getAllTelephones(): Promise<EtablissementTelephone[]> {
    return this.etablissementTelephoneRepository.find();
  }
}
