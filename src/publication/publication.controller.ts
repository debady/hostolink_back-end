
// import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
// import { PublicationService } from './publication.service';
// import { CreatePublicationDto } from './dto/create-publication.dto';
// import { Publication } from './entities/publication.entity';
// import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
// import { CreateCommentaireDto } from 'src/commentaire/dto/create-commentaire.dto';

// @Controller('publication')
// export class PublicationController {
//   constructor(private readonly publicationService: PublicationService) {}

//   @Post()
//   create(@Body() createPublicationDto: CreatePublicationDto): Promise<Publication> {
//     return this.publicationService.create(createPublicationDto);
//   }

//   @Get()
//   findAll(): Promise<Publication[]> {
//     return this.publicationService.findAll();
//   }

//   // récupérer une publication spécifique | QUI NOUS PERMETTRA DE PATARGER UNE PUBLICATION
//   @Get(':id')
//   findOne(@Param('id', ParseIntPipe) id: number): Promise<Publication> {
//     return this.publicationService.findOne(id);
//   }

//   @Get('user/:userId')
//   findByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Publication[]> {
//     return this.publicationService.findByUserId(userId);
//   }

//   // Ajouter un commentaire à une publication
//   @Post(':id_publication/commentaire')
//   addComment(
//     @Param('id_publication', ParseIntPipe) id_publication: number,
//     @Body() createCommentaireDto: CreateCommentaireDto
//   ): Promise<Commentaire> {
//     // Fusionner l'ID de la publication de l'URL avec le DTO
//     const commentaireData = {
//       ...createCommentaireDto,
//       id_publication
//     };
//     return this.publicationService.addComment(commentaireData);
//   }

//   // Récupérer les commentaires d'une publication
//   @Get(':id_publication/commentaire')
//   getCommentsByPublicationId(
//     @Param('id_publication', ParseIntPipe) id_publication: number
//   ): Promise<Commentaire[]> {
//     return this.publicationService.getCommentsByPublicationId(id_publication);
//   }


// // gestion des like et dislike
//   @Post(':id/like')
//   likePost(@Param('id', ParseIntPipe) id: number): Promise<Publication> {
//     return this.publicationService.likePost(id);
//   }

//   @Post(':id/dislike')
//   dislikePost(@Param('id', ParseIntPipe) id: number): Promise<Publication> {
//     return this.publicationService.dislikePost(id);
//   }



// // Supprimer une Publication
// @Delete(':id')
// async deletePublication(
//   @Param('id', ParseIntPipe) id: number,
//   @Body() body: { id_user: number } // Récupérer l'id de l'utilisateur qui supprime
// ) {
//   return this.publicationService.deletePublication(id, body.id_user);
// }

// }


import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  ParseIntPipe, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  ValidationPipe 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { Publication } from './entities/publication.entity';
import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { CreateCommentaireDto } from 'src/commentaire/dto/create-commentaire.dto';

@Controller('publication')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  // ✅ Créer une publication avec upload d'image
  @Post()
  @UseInterceptors(FileInterceptor('image')) // 📤 Gestion de l’upload d’image
  async create(
    @Body() body: any, // 📌 Accepter `multipart/form-data` brut
    @UploadedFile() file: Express.Multer.File // 📸 Récupérer l'image uploadée
  ): Promise<Publication> {
    // ✅ Convertir manuellement les valeurs reçues en types corrects
    const createPublicationDto: CreatePublicationDto = {
      titre_publication: String(body.titre_publication), // Convertir en string
      contenu: String(body.contenu), // Convertir en string
      id_user: parseInt(body.id_user, 10) // Convertir en `number`
    };

    return this.publicationService.create(createPublicationDto, file);
  }

  @Get()
  findAll(): Promise<Publication[]> {
    return this.publicationService.findAll();
  }

  // ✅ Récupérer une publication spécifique
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Publication> {
    return this.publicationService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Publication[]> {
    return this.publicationService.findByUserId(userId);
  }

  // ✅ Ajouter un commentaire à une publication
  @Post(':id_publication/commentaire')
  async addComment(
    @Param('id_publication', ParseIntPipe) id_publication: number,
    @Body() body: any
  ): Promise<Commentaire> {
    // ✅ Convertir manuellement les valeurs reçues
    const createCommentaireDto: CreateCommentaireDto = {
      contenu: String(body.contenu),
      id_user: parseInt(body.id_user, 10),
      id_publication: id_publication,
    };

    return this.publicationService.addComment(createCommentaireDto);
  }

  // ✅ Récupérer les commentaires d'une publication
  @Get(':id_publication/commentaire')
  getCommentsByPublicationId(
    @Param('id_publication', ParseIntPipe) id_publication: number
  ): Promise<Commentaire[]> {
    return this.publicationService.getCommentsByPublicationId(id_publication);
  }

  // ✅ Gestion des likes et dislikes
  @Post(':id/like')
  likePost(@Param('id', ParseIntPipe) id: number): Promise<Publication> {
    return this.publicationService.likePost(id);
  }

  @Post(':id/dislike')
  dislikePost(@Param('id', ParseIntPipe) id: number): Promise<Publication> {
    return this.publicationService.dislikePost(id);
  }

  // ✅ Supprimer une publication
  @Delete(':id')
  async deletePublication(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { id_user: number } // Récupérer l'id de l'utilisateur qui supprime
  ) {
    return this.publicationService.deletePublication(id, body.id_user);
  }
}
