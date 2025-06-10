import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commentaire } from './entities/commentaire.entity';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';

@Injectable()
export class CommentaireService {
  private readonly logger = new Logger(CommentaireService.name);

  constructor(
    @InjectRepository(Commentaire)
    private readonly commentaireRepository: Repository<Commentaire>,
  ) {}

  async create(id_publication: number, createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
    this.logger.log('💬 Création commentaire');
    
    // Validation: s'assurer qu'exactement un ID est fourni
    this.validateSingleAuthor(createCommentaireDto);

    const commentaireData: Partial<Commentaire> = {
      contenu: createCommentaireDto.contenu,
      publication: { id_publication } as any,
    };

    // Copier automatiquement l'ID fourni
    if (createCommentaireDto.id_user) {
      commentaireData.id_user = createCommentaireDto.id_user;
    }
    if (createCommentaireDto.id_user_etablissement_sante) {
      commentaireData.id_user_etablissement_sante = createCommentaireDto.id_user_etablissement_sante;
    }
    if (createCommentaireDto.id_admin_gestionnaire) {
      commentaireData.id_admin_gestionnaire = createCommentaireDto.id_admin_gestionnaire;
    }
    if (createCommentaireDto.id_expert) {
      commentaireData.id_expert = createCommentaireDto.id_expert;
    }

    const commentaire = this.commentaireRepository.create(commentaireData);
    const savedCommentaire = await this.commentaireRepository.save(commentaire);
    
    this.logger.log(`✅ Commentaire créé avec ID: ${savedCommentaire.id_commentaire}`);
    return savedCommentaire;
  }

  private validateSingleAuthor(dto: CreateCommentaireDto): void {
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

  async findByPublicationId(id_publication: number): Promise<Commentaire[]> {
    return this.commentaireRepository.find({
      where: { publication: { id_publication } },
      order: { date_commentaire: 'DESC' }
    });
  }

  async findByUserAndPublication(id_publication: number, id_user: string): Promise<Commentaire[]> {
    return this.commentaireRepository.find({
      where: { 
        publication: { id_publication },
        id_user 
      },
      order: { date_commentaire: 'DESC' }
    });
  }

  async findByEtablissementAndPublication(id_publication: number, id_etablissement: number): Promise<Commentaire[]> {
    return this.commentaireRepository.find({
      where: { 
        publication: { id_publication },
        id_user_etablissement_sante: id_etablissement 
      },
      order: { date_commentaire: 'DESC' }
    });
  }

  async findByAdminAndPublication(id_publication: number, id_admin: number): Promise<Commentaire[]> {
    return this.commentaireRepository.find({
      where: { 
        publication: { id_publication },
        id_admin_gestionnaire: id_admin 
      },
      order: { date_commentaire: 'DESC' }
    });
  }

  async findByExpertAndPublication(id_publication: number, id_expert: number): Promise<Commentaire[]> {
    return this.commentaireRepository.find({
      where: { 
        publication: { id_publication },
        id_expert 
      },
      order: { date_commentaire: 'DESC' }
    });
  }

// recuperer le nombre de commentaire par publication
  async getCommentsCount(id_publication: number): Promise<{ commentaires_count: number }> {
  const count = await this.commentaireRepository.count({
    where: { publication: { id_publication } }
  });

  return { commentaires_count: count };
}



}