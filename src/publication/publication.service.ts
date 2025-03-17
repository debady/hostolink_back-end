// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreatePublicationDto } from './dto/create-publication.dto';
// import { Publication } from './entities/publication.entity';
// import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
// import { CreateCommentaireDto } from 'src/commentaire/dto/create-commentaire.dto';

// @Injectable()
// export class PublicationService {
//   partageService: any;
//   constructor(
//     @InjectRepository(Publication)
//     private readonly publicationRepository: Repository<Publication>,
//     @InjectRepository(Commentaire)
//     private readonly commentaireRepository: Repository<Commentaire>,
//   ) {}

//   // creer une publication
//   async create(createPublicationDto: CreatePublicationDto): Promise<Publication> {
//     const { id_user, ...publicationData } = createPublicationDto;
    
//     const publication = this.publicationRepository.create({
//       ...publicationData,
//       date_publication: new Date(),
//       compteur_like: 0,
//       user: { id_user }
//     });
    
//     return this.publicationRepository.save(publication);
//   }

//   //  recupérer une publication spécifique
//   async findOne(id_publication: number): Promise<Publication> {
//     const publication = await this.publicationRepository.findOne({
//       where: { id_publication },
//       relations: ['user', 'commentaires', 'commentaires.user'],
//     });
    
//     if (!publication) {
//       throw new NotFoundException(`Publication avec l'ID ${id_publication} non trouvée`);
//     }
    
//     return publication;
//   }


//   // Méthode pour ajouter un like à une publication
//     async likePost(id_publication: number): Promise<Publication> {
//       const publication = await this.publicationRepository.findOne({ 
//         where: { id_publication } 
//       });

//       if (!publication) {
//         throw new Error('Publication not found');
//       }

//       publication.compteur_like += 1; // Incrémente le compteur de likes
//       return this.publicationRepository.save(publication);
//     }

//     // Méthode pour retirer un like d'une publication
//     async dislikePost(id_publication: number): Promise<Publication> {
//       const publication = await this.publicationRepository.findOne({ 
//         where: { id_publication } 
//       });

//       if (!publication) {
//         throw new Error('Publication not found');
//       }

//       if (publication.compteur_like > 0) {
//         publication.compteur_like -= 1; // Décrémente le compteur de likes
//       }
//       return this.publicationRepository.save(publication);
//     }

//     // récuperer toutes les publications avec les commentaires 
//   async findAll(): Promise<Publication[]> {
//     return this.publicationRepository.find({ 
//       relations: ['user', 'commentaires', 'commentaires.user'],
//       order: { date_publication: 'DESC' }
//     });
//   }

//   // récuperer les publications d'un utilisateur spécifique avec les commentaires 
//   async findByUserId(userId: number): Promise<Publication[]> {
//     return this.publicationRepository.find({
//       where: { user: { id_user: userId } },
//       relations: ['user', 'commentaires', 'commentaires.user'],
//       order: { date_publication: 'DESC' }
//     });
//   }

//   // Ajouter un commentaire à une publication
//   async addComment(createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
//     const { id_publication, id_user, contenu } = createCommentaireDto;
    
//     // Vérifier si la publication existe
//     const publication = await this.publicationRepository.findOne({
//       where: { id_publication }
//     });
    
//     if (!publication) {
//       throw new Error('Publication not found');
//     }
    
//     const commentaire = this.commentaireRepository.create({
//       contenu,
//       publication: { id_publication },
//       user: { id_user }
//     });
    
//     return this.commentaireRepository.save(commentaire);
//   }

//   // Récupérer les commentaires d'une publication
//   async getCommentsByPublicationId(id_publication: number): Promise<Commentaire[]> {
//     return this.commentaireRepository.find({
//       where: { publication: { id_publication } },
//       relations: ['user'],
//       order: { date_commentaire: 'DESC' }
//     });
//   }



  
//   // Endpoint pour Supprimer une Publication
//   async deletePublication(id_publication: number, id_user: number): Promise<{ success: boolean; message: string }> {
//     // Vérifier si la publication existe
//     const publication = await this.publicationRepository.findOne({
//       where: { id_publication },
//       relations: ['user', 'commentaires', 'Partages'], // Inclure les relations pour supprimer les éléments liés
//     });
  
//     if (!publication) {
//       throw new NotFoundException(`Publication avec l'ID ${id_publication} non trouvée.`);
//     }
  
//     // Vérifier si l'utilisateur est bien l'auteur de la publication
//     if (publication.user.id_user !== id_user) {
//       throw new Error('Vous n\'êtes pas autorisé à supprimer cette publication.');
//     }
  
//     // Supprimer les commentaires liés à la publication
//     if (publication.commentaires && publication.commentaires.length > 0) {
//       await this.commentaireRepository.remove(publication.commentaires);
//     }
  
//     // Supprimer les partages liés à la publication
//     if (publication.Partages && publication.Partages.length > 0) {
//       await this.partageService.deletePartagesByPublicationId(id_publication); // Assurez-vous d'avoir une méthode pour cela
//     }
  
//     // Supprimer la publication elle-même
//     await this.publicationRepository.remove(publication);
  
//     // Ajout d’un log (optionnel)
//     console.log(`📢 Vous utilisateur avec pour ID ${id_user} avez supprimée votre publication ${id_publication} `);
  
//     return { success: true, message: 'Publication supprimée avec succès.' };
//   }
  
  
// }



import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { Publication } from './entities/publication.entity';
import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { CreateCommentaireDto } from 'src/commentaire/dto/create-commentaire.dto';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class PublicationService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
    @InjectRepository(Commentaire)
    private readonly commentaireRepository: Repository<Commentaire>,
    @Inject('Cloudinary') private readonly cloudinaryService, // ✅ Injection de Cloudinary
  ) {}

  // ✅ Fonction pour uploader une image sur Cloudinary
  async uploadImageToCloudinary(file: Express.Multer.File): Promise<string | undefined> {
    if (!file || !file.buffer) {
      throw new Error('Le fichier est invalide ou non reçu');
    }

    try {
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'dossier_hostolink_preset' }, // 📂 Dossier Cloudinary
          (error, result) => {
            if (error) {
              console.error('❌ Erreur Cloudinary:', error);
              reject(new Error('Échec du téléchargement sur Cloudinary'));
            } else if (!result || !result.secure_url) {
              reject(new Error('Cloudinary n\'a retourné aucun résultat'));
            } else {
              resolve(result);
            }
          }
        );
        stream.end(file.buffer);
      });

      return result.secure_url; // ✅ Retourne l'URL Cloudinary de l’image
    } catch (error) {
      console.error('❌ Erreur Cloudinary:', error);
      return undefined; // ✅ Retourne `undefined` en cas d'échec
    }
  }

  // ✅ Créer une publication avec upload d'image
  async create(createPublicationDto: CreatePublicationDto, file?: Express.Multer.File): Promise<Publication> {
    const { id_user, ...publicationData } = createPublicationDto;
    let imageUrl: string | undefined;

    if (file) {
      imageUrl = await this.uploadImageToCloudinary(file) ?? undefined; // 📤 Upload sur Cloudinary
    }

    const publication = this.publicationRepository.create({
      ...publicationData,
      image: imageUrl, // 📌 Stocker l’URL Cloudinary en BD
      date_publication: new Date(),
      compteur_like: 0,
      user: { id_user }
    });

    return this.publicationRepository.save(publication);
  }

  // ✅ Récupérer une publication spécifique
  async findOne(id_publication: number): Promise<Publication> {
    const publication = await this.publicationRepository.findOne({
      where: { id_publication },
      relations: ['user', 'commentaires', 'commentaires.user'],
    });

    if (!publication) {
      throw new NotFoundException(`Publication avec l'ID ${id_publication} non trouvée`);
    }

    return publication;
  }

  // ✅ Ajouter un like à une publication
  async likePost(id_publication: number): Promise<Publication> {
    const publication = await this.publicationRepository.findOne({ where: { id_publication } });

    if (!publication) {
      throw new Error('Publication not found');
    }

    publication.compteur_like += 1;
    return this.publicationRepository.save(publication);
  }

  // ✅ Retirer un like d'une publication
  async dislikePost(id_publication: number): Promise<Publication> {
    const publication = await this.publicationRepository.findOne({ where: { id_publication } });

    if (!publication) {
      throw new Error('Publication not found');
    }

    if (publication.compteur_like > 0) {
      publication.compteur_like -= 1;
    }
    return this.publicationRepository.save(publication);
  }

  // ✅ Récupérer toutes les publications avec les commentaires
  async findAll(): Promise<Publication[]> {
    return this.publicationRepository.find({
      relations: ['user', 'commentaires', 'commentaires.user'],
      order: { date_publication: 'DESC' },
    });
  }

  // ✅ Récupérer les publications d'un utilisateur spécifique
  async findByUserId(userId: number): Promise<Publication[]> {
    return this.publicationRepository.find({
      where: { user: { id_user: userId } },
      relations: ['user', 'commentaires', 'commentaires.user'],
      order: { date_publication: 'DESC' },
    });
  }

  // ✅ Ajouter un commentaire à une publication
  async addComment(createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
    const { id_publication, id_user, contenu } = createCommentaireDto;

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

  // ✅ Récupérer les commentaires d'une publication
  async getCommentsByPublicationId(id_publication: number): Promise<Commentaire[]> {
    return this.commentaireRepository.find({
      where: { publication: { id_publication } },
      relations: ['user'],
      order: { date_commentaire: 'DESC' },
    });
  }

  // ✅ Supprimer une publication et son image sur Cloudinary
  async deletePublication(id_publication: number, id_user: number): Promise<{ success: boolean; message: string }> {
    const publication = await this.publicationRepository.findOne({
      where: { id_publication },
      relations: ['user', 'commentaires'],
    });

    if (!publication) {
      throw new NotFoundException(`Publication avec l'ID ${id_publication} non trouvée.`);
    }

    if (publication.user.id_user !== id_user) {
      throw new Error('Vous n\'êtes pas autorisé à supprimer cette publication.');
    }

    // ✅ Supprimer l'image Cloudinary si elle existe
    if (publication.image) {
      try {
        const publicId = publication.image.split('/').pop()?.split('.')[0];
        await cloudinary.uploader.destroy(`publications/${publicId}`);
      } catch (error) {
        console.error('❌ Erreur lors de la suppression de l’image sur Cloudinary:', error);
      }
    }

    // ✅ Supprimer les commentaires liés
    if (publication.commentaires && publication.commentaires.length > 0) {
      await this.commentaireRepository.remove(publication.commentaires);
    }

    // ✅ Supprimer la publication
    await this.publicationRepository.remove(publication);

    console.log(`📢 L'utilisateur ID ${id_user} a supprimé la publication ID ${id_publication}`);

    return { success: true, message: 'Publication supprimée avec succès.' };
  }
}
