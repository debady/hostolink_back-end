import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListeNumeroEtablissementSante, TypeEtablissementEnum } from './entities/liste_numero_vert_etablissement_sante.entity';
import { CreateListeNumeroVertEtablissementSanteDto } from './dto/create-liste-numero-vert-etablissement-sante.dto';
import { ResponseListeNumeroVertEtablissementSanteDto } from './dto/response_liste_numero_vert_etablissement_sante.dto';
import { CloudinaryService } from 'src/upload/cloudinary.service';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';

@Injectable()
export class ListeNumeroEtablissementSanteService {
  constructor(
    @InjectRepository(ListeNumeroEtablissementSante)
    private readonly listeNumeroRepo: Repository<ListeNumeroEtablissementSante>,
    
    @InjectRepository(Administrateur)
    private readonly adminRepo: Repository<Administrateur>,
    
    private readonly cloudinaryService: CloudinaryService, 
  ) {}

  /**
   * ✅ Créer un numéro vert
   */
  async create(dto: CreateListeNumeroVertEtablissementSanteDto, file?: Express.Multer.File) {
    let imageUrl = '';


    // ✅ Vérifie que `categorie` et `type_etablissement` sont bien renseignés
    const categoriesValides = ['hopital', 'clinique', 'pharmacie'];
    if (!categoriesValides.includes(dto.categorie.toLowerCase())) {
      throw new BadRequestException(`La catégorie '${dto.categorie}' n'est pas valide.`);
    }

    if (!Object.values(TypeEtablissementEnum).includes(dto.type_etablissement as TypeEtablissementEnum)) {
      throw new BadRequestException(`Le type d'établissement doit être 'hopital', 'clinique' ou 'pharmacie'.`);
    }

    // ✅ Vérifier si une image est envoyée, et l'uploader sur Cloudinary
    if (file) {
      try {
        imageUrl = await this.cloudinaryService.uploadImage(file);
      } catch (error) {
        throw new InternalServerErrorException('Échec de l’upload de l’image sur Cloudinary.');
      }
    }
   // ✅ Vérifier si l'administrateur existe
   const admin = await this.adminRepo.findOne({ where: { id_admin_gestionnaire: dto.id_admin_gestionnaire } });
   if (!admin) {
     throw new NotFoundException(`Administrateur avec l'ID ${dto.id_admin_gestionnaire} non trouvé.`);
   }
    
    // ✅ Créer l'entité avec l'URL Cloudinary
    const newNumero = this.listeNumeroRepo.create({
      ...dto,
      image: imageUrl,  // Stocker l'URL Cloudinary dans la base de données
      type_etablissement: dto.type_etablissement.toLowerCase() as TypeEtablissementEnum,
      administrateur: admin, // Associer à l'administrateur
    });

    return await this.listeNumeroRepo.save(newNumero);
  }
   /**
   * ✅ Récupérer tous les numéros verts avec URL Cloudinary
   */
   async findAll(): Promise<ResponseListeNumeroVertEtablissementSanteDto[]> {
    const numeros = await this.listeNumeroRepo.find({ relations: ['administrateur'] });
    return numeros.map(numero => this.mapToResponseDto(numero));
  }

  /**
   * ✅ Récupérer un numéro vert par ID avec URL Cloudinary
   */
  async findOne(id: number): Promise<ResponseListeNumeroVertEtablissementSanteDto> {
    if (!id || isNaN(id)) {
      throw new Error('ID invalide. Un entier valide est requis.');
    }

    const numero = await this.listeNumeroRepo.findOne({
      where: { id_liste_num_etablissement_sante: id },
      relations: ['administrateur'],
    });

    if (!numero) {
      throw new NotFoundException(`Numéro vert avec l'ID ${id} non trouvé`);
    }

    return this.mapToResponseDto(numero);
  }
  /**
   * ✅ Récupérer les établissements par catégorie
   */
  async findByCategory(categorie: string): Promise<ResponseListeNumeroVertEtablissementSanteDto[]> {
    if (!categorie || categorie.toLowerCase() === 'tous') {
      return this.findAll(); // Retourner tout si aucune catégorie n'est précisée
    }

    const categoriesValides = ['hopital', 'clinique', 'pharmacie'];

    if (!categoriesValides.includes(categorie.toLowerCase())) {
      throw new NotFoundException(`La catégorie '${categorie}' n'est pas valide.`);
    }

    const numeros = await this.listeNumeroRepo.find({
      where: { categorie: categorie.toLowerCase() },
      relations: ['administrateur'],
    });

    return numeros.map(numero => this.mapToResponseDto(numero));
  }

  /**
   * ✅ Mapper un enregistrement en DTO de réponse
   */
  private mapToResponseDto(numero: ListeNumeroEtablissementSante): ResponseListeNumeroVertEtablissementSanteDto {
    return {
      id_liste_num_etablissement_sante: numero.id_liste_num_etablissement_sante,
      id_admin_gestionnaire: numero.administrateur.id_admin_gestionnaire ,// Vérifie si admin est présent
      nom_etablissement: numero.nom_etablissement,
      contact: numero.contact,
      image: numero.image , // Gère le cas où l'image est absente
      presentation: numero.presentation,
      adresse: numero.adresse,
      latitude: numero.latitude,
      longitude: numero.longitude,
      type_etablissement: numero.type_etablissement,
      categorie: numero.categorie,
      site_web: numero.site_web ,
    };
  }
}
