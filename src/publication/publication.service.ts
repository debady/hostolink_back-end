
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from './entities/publication.entity';
import { SocialCloudinaryService } from 'src/social_cloudinary/social_cloudinary.service';



@Injectable()
export class PublicationService {
  private readonly logger = new Logger(PublicationService.name);

  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
    private readonly SocialCloudinaryService: SocialCloudinaryService,
  ) {}


  async create(data: any, imageFile?: Express.Multer.File): Promise<Publication> {
  if (!data || typeof data !== 'object') {
    throw new BadRequestException('Données de publication manquantes ou invalides.');
  }

  this.validateSingleAuthor(data);

  let imageUrl: string | undefined = undefined;

  if (imageFile) {
    try {
      imageUrl = await this.SocialCloudinaryService.uploadImage(imageFile);
    } catch (error) {
      throw new BadRequestException('Erreur lors de l’upload de l’image : ' + error.message);
    }
  }

  const publicationData: Partial<Publication> = {
    titre_publication: data.titre_publication,
    contenu: data.contenu,
    image: imageUrl,
    compteur_like: 0,
  };

  if (data.id_user) publicationData.id_user = data.id_user;
  if (data.id_user_etablissement_sante) publicationData.id_user_etablissement_sante = data.id_user_etablissement_sante;
  if (data.id_admin_gestionnaire) publicationData.id_admin_gestionnaire = data.id_admin_gestionnaire;
  if (data.id_expert) publicationData.id_expert = data.id_expert;

  const publication = this.publicationRepository.create(publicationData);
  const savedPublication = await this.publicationRepository.save(publication);

  this.logger.log(`✅ Publication créée avec ID: ${savedPublication.id_publication}`);
  return savedPublication;
}




  private validateSingleAuthor(data: any): void {
    if (!data || typeof data !== 'object') {
      throw new BadRequestException('Données invalides pour valider l’auteur.');
    }

    const authorFields = [
      data.id_user,
      data.id_user_etablissement_sante,
      data.id_admin_gestionnaire,
      data.id_expert,
    ].filter((field) => field !== undefined && field !== null);

    if (authorFields.length === 0) {
      throw new BadRequestException(
        'Au moins un ID d\'auteur doit être fourni (user, établissement, admin ou expert)',
      );
    }

    if (authorFields.length > 1) {
      throw new BadRequestException('Un seul ID d\'auteur doit être fourni');
    }
  }

  async findAll(): Promise<Publication[]> {
    return this.publicationRepository.find({
      relations: ['commentaires', 'partages'],
      order: { date_publication: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Publication> {
    const publication = await this.publicationRepository.findOne({
      where: { id_publication: id },
      relations: ['commentaires', 'partages'],
    });

    if (!publication) {
      throw new NotFoundException(`Publication avec l'ID ${id} non trouvée`);
    }

    return publication;
  }

  async findByUser(id_user: string): Promise<Publication[]> {
    return this.publicationRepository.find({
      where: { id_user },
      relations: ['commentaires', 'partages'],
      order: { date_publication: 'DESC' },
    });
  }

  async findByEtablissement(id_user_etablissement_sante: number): Promise<Publication[]> {
    return this.publicationRepository.find({
      where: { id_user_etablissement_sante },
      relations: ['commentaires', 'partages'],
      order: { date_publication: 'DESC' },
    });
  }

  async findByAdmin(id_admin_gestionnaire: number): Promise<Publication[]> {
    return this.publicationRepository.find({
      where: { id_admin_gestionnaire },
      relations: ['commentaires', 'partages'],
      order: { date_publication: 'DESC' },
    });
  }

  async findByExpert(id_expert: number): Promise<Publication[]> {
    return this.publicationRepository.find({
      where: { id_expert },
      relations: ['commentaires', 'partages'],
      order: { date_publication: 'DESC' },
    });
  }

  async likePost(id: number): Promise<Publication> {
    const publication = await this.findOne(id);
    publication.compteur_like += 1;
    return this.publicationRepository.save(publication);
  }

  async dislikePost(id: number): Promise<Publication> {
    const publication = await this.findOne(id);
    if (publication.compteur_like > 0) {
      publication.compteur_like -= 1;
    }
    return this.publicationRepository.save(publication);
  }
}
