
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commentaire } from './entities/commentaire.entity';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { Publication } from 'src/publication/entities/publication.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CommentaireService {
  constructor(
    @InjectRepository(Commentaire)
    private readonly commentaireRepository: Repository<Commentaire>,
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(id_publication: number, createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
    const { id_user, contenu } = createCommentaireDto;

    // Vérifier si la publication existe
    const publication = await this.publicationRepository.findOne({
      where: { id_publication },
    });

    if (!publication) {
      throw new NotFoundException(`Publication avec id ${id_publication} non trouvée`);
    }

    // Vérifier si l'utilisateur existe
    const user = await this.userRepository.findOne({
      where: { id_user },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec id ${id_user} non trouvé`);
    }

    // Créer et sauvegarder le commentaire
    const commentaire = this.commentaireRepository.create({
      contenu,
      publication,
      user,
    });

    return this.commentaireRepository.save(commentaire);
  }

  // ✅ Récupérer tous les commentaires d'une publication spécifique
  async findByPublicationId(id_publication: number): Promise<Commentaire[]> {
    return this.commentaireRepository.find({
      where: { publication: { id_publication } },
      relations: ['user'],
      order: { date_commentaire: 'DESC' },
    });
  }

  // ✅ Récupérer tous les commentaires d'une publication spécifique par un utilisateur donné
  async findByPublicationIdAndUserId(id_publication: number, id_user: number): Promise<Commentaire[]> {
    return this.commentaireRepository.find({
      where: {
        publication: { id_publication },
        user: { id_user },
      },
      relations: ['user'],
      order: { date_commentaire: 'DESC' },
    });
  }

  // ✅ suppression d’un commentaire par son auteur
  async deleteComment(id_commentaire: number, id_user: number): Promise<{ success: boolean; message: string }> {
    // Vérifier si le commentaire existe
    const commentaire = await this.commentaireRepository.findOne({
      where: { id_commentaire },
      relations: ['user'], // Charger l'utilisateur associé
    });
  
    if (!commentaire) {
      throw new NotFoundException(`Commentaire avec l'ID ${id_commentaire} non trouvé.`);
    }
  
    // Vérifier si l'utilisateur est bien l'auteur du commentaire
    if (commentaire.user.id_user !== id_user) {
      throw new Error('Vous n\'êtes pas autorisé à supprimer ce commentaire.');
    }
  
    // Supprimer le commentaire
    await this.commentaireRepository.remove(commentaire);
  
    // Ajout d’un log (optionnel)
    console.log(`🗑️ utilisateur ${id_user}, vous avez supprimé votre Commentaire.  ID_commentaire ${id_commentaire} `);
  
    return { success: true, message: 'Commentaire supprimé avec succès.' };
  }
  





}
