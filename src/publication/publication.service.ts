
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreatePublicationDto } from './dto/create-publication.dto';
// import { Publication } from './entities/publication.entity';
// import { User } from 'src/user/entities/user.entity';

// @Injectable()
// export class PublicationService {
//   constructor(
//     @InjectRepository(Publication)
//     private readonly publicationRepository: Repository<Publication>,
//   ) {}

//   async create(createPublicationDto: CreatePublicationDto, id_user: number): Promise<Publication> {
//     // Créez un nouvel objet publication avec les données fournies
//     const publication = this.publicationRepository.create({
//         ...createPublicationDto,
//         date_publication: new Date(), // Assurez-vous que le champ est correct
//         compteur_like: 0,
//         user: { id_user }  // Assurez-vous que 'user' est typé correctement
//     });
//     return this.publicationRepository.save(publication);
// }

//   async findAll(): Promise<Publication[]> {
//     return this.publicationRepository.find({ relations: ['user'] }); // Ajoutez des relations si nécessaire
//   }

//   async likePost(id_publication: number): Promise<Publication> {
//     const publication = await this.publicationRepository.findOne({ where: { id_publication } });

//     if (!publication) {
//       throw new Error('Publication not found');
//     }

//     publication.compteur_like += 1; // Incrémente le compteur de likes
//     return this.publicationRepository.save(publication);
//   }

//   async dislikePost(id_publication: number): Promise<Publication> {
//     const publication = await this.publicationRepository.findOne({ where: { id_publication } });

//     if (!publication) {
//       throw new Error('Publication not found');
//     }

//     if (publication.compteur_like > 0) {
//       publication.compteur_like -= 1; // Décrémente le compteur de likes
//     }
//     return this.publicationRepository.save(publication);
//   }

//   async findByUserId(id_user: number): Promise<Publication[]> {
//     return this.publicationRepository.find({
//       where: { user: { id_user: id_user } },
//       relations: ['user'],
//       order: { date_publication: 'DESC' } // Pour avoir les plus récentes d'abord
//     });
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { Publication } from './entities/publication.entity';
import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { CreateCommentaireDto } from 'src/commentaire/dto/create-commentaire.dto';

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
    @InjectRepository(Commentaire)
    private readonly commentaireRepository: Repository<Commentaire>,
  ) {}

  async create(createPublicationDto: CreatePublicationDto): Promise<Publication> {
    const { id_user, ...publicationData } = createPublicationDto;
    
    const publication = this.publicationRepository.create({
      ...publicationData,
      date_publication: new Date(),
      compteur_like: 0,
      user: { id_user }
    });
    
    return this.publicationRepository.save(publication);
  }

  async findAll(): Promise<Publication[]> {
    return this.publicationRepository.find({ 
      relations: ['user', 'commentaires', 'commentaires.user'],
      order: { date_publication: 'DESC' }
    });
  }

  async findByUserId(userId: number): Promise<Publication[]> {
    return this.publicationRepository.find({
      where: { user: { id_user: userId } },
      relations: ['user', 'commentaires', 'commentaires.user'],
      order: { date_publication: 'DESC' }
    });
  }

  // Ajouter un commentaire à une publication
  async addComment(createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
    const { id_publication, id_user, contenu } = createCommentaireDto;
    
    // Vérifier si la publication existe
    const publication = await this.publicationRepository.findOne({
      where: { id_publication }
    });
    
    if (!publication) {
      throw new Error('Publication not found');
    }
    
    const commentaire = this.commentaireRepository.create({
      contenu,
      publication: { id_publication },
      user: { id_user }
    });
    
    return this.commentaireRepository.save(commentaire);
  }

  // Récupérer les commentaires d'une publication
  async getCommentsByPublicationId(id_publication: number): Promise<Commentaire[]> {
    return this.commentaireRepository.find({
      where: { publication: { id_publication } },
      relations: ['user'],
      order: { date_commentaire: 'DESC' }
    });
  }

  // Autres méthodes existantes...
}