import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partage } from './entities/partage.entity';
// import { CreatePartageDto } from './dto/create-partage.dto';
import { v4 as uuidv4 } from 'uuid';
import { CreatePartageDto } from './dto/partage.dto';

@Injectable()
export class PartageService {
  private readonly logger = new Logger(PartageService.name);

  constructor(
    @InjectRepository(Partage)
    private readonly partageRepository: Repository<Partage>,
  ) {}

  async create(createPartageDto: CreatePartageDto): Promise<Partage> {
    this.logger.log('🔗 Création partage');
    
    // Validation: s'assurer qu'exactement un ID est fourni
    this.validateSingleAuthor(createPartageDto);

    // Générer un lien unique
    const uniqueId = uuidv4();
    const lienPartage = `${process.env.APP_URL || 'http://localhost:3000'}/shared/${uniqueId}`;

    const partageData: Partial<Partage> = {
      publication: { id_publication: createPartageDto.id_publication } as any,
      lien_partage: lienPartage,
      plateforme_partage: createPartageDto.plateforme_partage,
      nombre_clics: 0,
    };

    // Copier automatiquement l'ID fourni
    if (createPartageDto.id_user) {
      partageData.id_user = createPartageDto.id_user;
    }
    if (createPartageDto.id_user_etablissement_sante) {
      partageData.id_user_etablissement_sante = createPartageDto.id_user_etablissement_sante;
    }
    if (createPartageDto.id_admin_gestionnaire) {
      partageData.id_admin_gestionnaire = createPartageDto.id_admin_gestionnaire;
    }
    if (createPartageDto.id_expert) {
      partageData.id_expert = createPartageDto.id_expert;
    }

    const partage = this.partageRepository.create(partageData);
    const savedPartage = await this.partageRepository.save(partage);
    
    this.logger.log(`✅ Partage créé avec ID: ${savedPartage.id_partage}`);
    return savedPartage;
  }

  private validateSingleAuthor(dto: CreatePartageDto): void {
    const authorFields = [
      dto.id_user,
      dto.id_user_etablissement_sante,
      dto.id_admin_gestionnaire,
      dto.id_expert
    ].filter(field => field !== undefined && field !== null);

    if (authorFields.length === 0) {
      throw new BadRequestException('Au moins un ID d\'auteur doit être fourni (id_user, id_user_etablissement_sante, id_admin_gestionnaire, ou id_expert)');
    }

    if (authorFields.length > 1) {
      throw new BadRequestException('Un seul ID d\'auteur doit être fourni');
    }
  }

  async findByPublication(id_publication: number): Promise<Partage[]> {
    return this.partageRepository.find({
      where: { publication: { id_publication } },
      order: { date_partage: 'DESC' }
    });
  }

  async findByUser(id_user: string): Promise<Partage[]> {
    return this.partageRepository.find({
      where: { id_user },
      relations: ['publication'],
      order: { date_partage: 'DESC' }
    });
  }

  async findByEtablissement(id_etablissement: number): Promise<Partage[]> {
    return this.partageRepository.find({
      where: { id_user_etablissement_sante: id_etablissement },
      relations: ['publication'],
      order: { date_partage: 'DESC' }
    });
  }

  async findByAdmin(id_admin: number): Promise<Partage[]> {
    return this.partageRepository.find({
      where: { id_admin_gestionnaire: id_admin },
      relations: ['publication'],
      order: { date_partage: 'DESC' }
    });
  }

  async findByExpert(id_expert: number): Promise<Partage[]> {
    return this.partageRepository.find({
      where: { id_expert },
      relations: ['publication'],
      order: { date_partage: 'DESC' }
    });
  }

  async findByUniqueId(uniqueId: string): Promise<Partage> {
    const lienPartage = `${process.env.APP_URL || 'http://localhost:3000'}/shared/${uniqueId}`;
    const partage = await this.partageRepository.findOne({
      where: { lien_partage: lienPartage },
      relations: ['publication'],
    });

    if (!partage) {
      throw new BadRequestException('Partage introuvable');
    }

    return partage;
  }

  async incrementClics(id_partage: number): Promise<Partage> {
    const partage = await this.partageRepository.findOne({
      where: { id_partage },
    });

    if (!partage) {
      throw new BadRequestException('Partage introuvable');
    }

    partage.nombre_clics += 1;
    return this.partageRepository.save(partage);
  }

  async countByPublication(id_publication: number): Promise<number> {
    return this.partageRepository.count({
      where: { publication: { id_publication } }
    });
  }

  async getPublicationShareStats(id_publication: number): Promise<any> {
    const totalShares = await this.countByPublication(id_publication);
    
    // Statistiques par type d'auteur
    const stats = await this.partageRepository
      .createQueryBuilder('partage')
      .where('partage.id_publication = :id_publication', { id_publication })
      .getMany();

    const userShares = stats.filter(s => s.id_user).length;
    const etablissementShares = stats.filter(s => s.id_user_etablissement_sante).length;
    const adminShares = stats.filter(s => s.id_admin_gestionnaire).length;
    const expertShares = stats.filter(s => s.id_expert).length;

    // Total des clics
    const totalClics = stats.reduce((sum, partage) => sum + partage.nombre_clics, 0);

    return {
      total_shares: totalShares,
      total_clics: totalClics,
      by_author_type: {
        user: userShares,
        etablissement: etablissementShares,
        admin: adminShares,
        expert: expertShares
      }
    };
  }
}