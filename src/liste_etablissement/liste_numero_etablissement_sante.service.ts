import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListeNumeroEtablissementSante } from './entities/liste_numero_vert_etablissement_sante.entity';
import { CreateListeNumeroVertEtablissementSanteDto } from './dto/create-liste-numero-vert-etablissement-sante.dto';
import { ResponseListeNumeroVertEtablissementSanteDto } from './dto/response_liste_numero_vert_etablissement_sante.dto';
import { CloudinaryService } from 'src/upload/cloudinary.service';



@Injectable()
export class ListeNumeroEtablissementSanteService {
 
  constructor(
    @InjectRepository(ListeNumeroEtablissementSante)
    private readonly listeNumeroRepo: Repository<ListeNumeroEtablissementSante>,
    private readonly cloudinaryService: CloudinaryService, 
  ) {}

  async create(dto: CreateListeNumeroVertEtablissementSanteDto, file?: Express.Multer.File) {
    let imageUrl: string = dto.image || ''; // Garde l'URL de l'image si elle est déjà fournie

    // ✅ Si un fichier est envoyé, on l'upload sur Cloudinary
    if (file) {
      try {
        imageUrl = await this.cloudinaryService.uploadImage(file);
      } catch (error) {
        throw new InternalServerErrorException('Erreur lors de l’upload de l’image sur Cloudinary.');
      }
    }

    // ✅ Création de l'entrée en base de données
    const newNumero = this.listeNumeroRepo.create({
      ...dto,
      image: imageUrl,
      id_admin_gestionnaire: dto.id_admin_gestionnaire || null, // Permet d'accepter NULL
    });

    return await this.listeNumeroRepo.save(newNumero);
  }

    // ✅ Méthode pour récupérer les numéros verts avec filtre
  async findByCategory(categorie: string): Promise<ResponseListeNumeroVertEtablissementSanteDto[]> {
    if (!categorie || categorie.toLowerCase() === 'tous') {
      return this.findAll(); // Si aucune catégorie n'est précisée, retourner tout
    }

    const categoriesValides = ['hopital', 'clinique', 'pharmacie'];

    if (!categoriesValides.includes(categorie.toLowerCase())) {
      throw new NotFoundException(`La catégorie '${categorie}' n'est pas valide.`);
    }

    const numeros = await this.listeNumeroRepo.find({
      where: { categorie: categorie.toLowerCase() },
    });

    return numeros.map(numero => this.mapToResponseDto(numero));
  }




   // ✅ Ajouter la récupération de tous les numéros verts
   async findAll(): Promise<ResponseListeNumeroVertEtablissementSanteDto[]> {
    const numeros = await this.listeNumeroRepo.find();
    return numeros.map(numero => ({
      id_liste_num_etablissement_sante: numero.id_liste_num_etablissement_sante,
      id_admin_gestionnaire: numero.id_admin_gestionnaire || null, // Gérer les valeurs null
      contact: numero.contact,
      image: numero.image,
      nom_etablissement: numero.nom_etablissement,
      presentation: numero.presentation,
      adresse: numero.adresse,
      latitude: numero.latitude,
      longitude: numero.longitude,
      site_web: numero.site_web,
      type_etablissement: numero.type_etablissement,
      categorie: numero.categorie,
      created_at: new Date(),
    }));
  }
  
  
   // ✅ Récupérer un numéro vert par ID
  async findOne(id: number): Promise<ResponseListeNumeroVertEtablissementSanteDto> {
   if (!id || isNaN(id)) {
   throw new Error('ID invalide. Un entier valide est requis.');
  }


  const numero = await this.listeNumeroRepo.findOne({ // ✅ Correction ici
     where: { id_liste_num_etablissement_sante: id },
  });

  if (!numero) {
    throw new NotFoundException(`Numéro vert avec l'ID ${id} non trouvé`);
  }

  return {
      id_liste_num_etablissement_sante: numero.id_liste_num_etablissement_sante,
      id_admin_gestionnaire: numero.id_admin_gestionnaire || null,
      contact: numero.contact,
      image: numero.image,
      nom_etablissement: numero.nom_etablissement,
      presentation: numero.presentation,
      adresse: numero.adresse,
      latitude: numero.latitude,
      longitude: numero.longitude,
      site_web: numero.site_web,
      type_etablissement: numero.type_etablissement,
      categorie: numero.categorie,
      created_at: new Date(),
  };
}
// ✅ Mapper un enregistrement en DTO de réponse
private mapToResponseDto(numero: ListeNumeroEtablissementSante): ResponseListeNumeroVertEtablissementSanteDto {
  return {
    id_liste_num_etablissement_sante: numero.id_liste_num_etablissement_sante,
    id_admin_gestionnaire: numero.id_admin_gestionnaire || null,
    contact: numero.contact,
    image: numero.image,  
    nom_etablissement: numero.nom_etablissement,
    presentation: numero.presentation,
    adresse: numero.adresse,
    latitude: numero.latitude,
    longitude: numero.longitude,
    site_web: numero.site_web ,
    type_etablissement: numero.type_etablissement,
    categorie: numero.categorie,  
    created_at: new Date(),  
  };
}
  
}





































































// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { UpdateListeNumeroVertEtablissementSanteDto } from './dto/update-liste-numero-vert-etablissement-sante.dto';
// import { CreateListeNumeroVertEtablissementSanteDto } from './dto/create-liste-numero-vert-etablissement-sante.dto';
// import { ListeNumeroVertEtablissementSante } from './entities/liste_numero_vert_etablissement_sante.entity';
// @Injectable()
// export class ListeNumeroVertEtablissementSanteService {
//   constructor(
//     @InjectRepository(ListeNumeroVertEtablissementSante)
//     private readonly listeNumeroVertRepository: Repository<ListeNumeroVertEtablissementSante>,
//   ) {}

//   async create(createListeNumeroVertDto: CreateListeNumeroVertEtablissementSanteDto): Promise<ListeNumeroVertEtablissementSante> {
//     const etablissement = this.listeNumeroVertRepository.create(createListeNumeroVertDto);
//     return await this.listeNumeroVertRepository.save(etablissement);
//   }

//   async findAll(): Promise<ListeNumeroVertEtablissementSante[]> {
//     return await this.listeNumeroVertRepository.find();
//   }

//   async findOne(id: number): Promise<ListeNumeroVertEtablissementSante> {
//     const etablissement = await this.listeNumeroVertRepository.findOne({ where: { id: id } });
//     if (!etablissement) {
//       throw new NotFoundException(`Établissement avec l'ID ${id} non trouvé`);
//     }
//     return etablissement;
//   }
  

//   async findByCategory(type: string): Promise<ListeNumeroVertEtablissementSante[]> {
//     return await this.listeNumeroVertRepository.find({  where: { type_etablissement: type }});
//   }
  

//   async update(id: number, updateListeNumeroVertDto: UpdateListeNumeroVertEtablissementSanteDto): Promise<ListeNumeroVertEtablissementSante> {
//     await this.findOne(id);
//     await this.listeNumeroVertRepository.update(id, updateListeNumeroVertDto);
//     return this.findOne(id);
//   }

//   async partialUpdate(id: number, updateListeNumeroVertDto: Partial<UpdateListeNumeroVertEtablissementSanteDto>): Promise<ListeNumeroVertEtablissementSante> {
//     await this.findOne(id);
//     await this.listeNumeroVertRepository.update(id, updateListeNumeroVertDto);
//     return this.findOne(id);
//   }

//   async remove(id: number): Promise<void> {
//     await this.findOne(id);
//     await this.listeNumeroVertRepository.delete(id);
//   }
// }
