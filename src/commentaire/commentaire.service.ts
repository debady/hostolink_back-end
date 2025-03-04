import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commentaire } from './entities/commentaire.entity';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';

@Injectable()
export class CommentaireService {
  constructor(
    @InjectRepository(Commentaire)
    private readonly commentaireRepository: Repository<Commentaire>,
  ) {}

  async create(createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
    const { id_publication, id_user, ...commentaireData } = createCommentaireDto;
    
    const commentaire = this.commentaireRepository.create({
      ...commentaireData,
      publication: { id_publication },
      user: { id_user }
    });
    
    return this.commentaireRepository.save(commentaire);
  }

  async findByPublicationId(id_publication: number): Promise<Commentaire[]> {
    return this.commentaireRepository.find({
      where: { publication: { id_publication } },
      relations: ['user'],
      order: { date_commentaire: 'DESC' }
    });
  }
}