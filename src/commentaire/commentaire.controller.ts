import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CommentaireService } from './commentaire.service';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { Commentaire } from './entities/commentaire.entity';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@Controller('commentaire')
@UseGuards(AuthGuard)
export class CommentaireController {
  constructor(private readonly commentaireService: CommentaireService) {}

  // Créer un commentaire sous une publication
  @Post(':id_publication/mon-commentaire')
  create(
    @Param('id_publication', ParseIntPipe) id_publication: number,
    @Body() createCommentaireDto: CreateCommentaireDto
  ): Promise<Commentaire> {
    return this.commentaireService.create(id_publication, createCommentaireDto);
  }

  // Récupérer tous les commentaires d'une publication
  @Get(':id_publication/commentaires')
  findByPublicationId(
    @Param('id_publication', ParseIntPipe) id_publication: number
  ): Promise<Commentaire[]> {
    return this.commentaireService.findByPublicationId(id_publication);
  }

  // Récupérer les commentaires d'un utilisateur sur une publication
  @Get(':id_publication/commentaire/user/:id_user')
  findByUserAndPublication(
    @Param('id_publication', ParseIntPipe) id_publication: number,
    @Param('id_user') id_user: string
  ): Promise<Commentaire[]> {
    return this.commentaireService.findByUserAndPublication(id_publication, id_user);
  }

  // Récupérer les commentaires d'un établissement sur une publication
  @Get(':id_publication/commentaire/etablissement/:id_etablissement')
  findByEtablissementAndPublication(
    @Param('id_publication', ParseIntPipe) id_publication: number,
    @Param('id_etablissement', ParseIntPipe) id_etablissement: number
  ): Promise<Commentaire[]> {
    return this.commentaireService.findByEtablissementAndPublication(id_publication, id_etablissement);
  }

  // Récupérer les commentaires d'un admin sur une publication
  @Get(':id_publication/commentaire/admin/:id_admin')
  findByAdminAndPublication(
    @Param('id_publication', ParseIntPipe) id_publication: number,
    @Param('id_admin', ParseIntPipe) id_admin: number
  ): Promise<Commentaire[]> {
    return this.commentaireService.findByAdminAndPublication(id_publication, id_admin);
  }

  // Récupérer les commentaires d'un expert sur une publication
  @Get(':id_publication/commentaire/expert/:id_expert')
  findByExpertAndPublication(
    @Param('id_publication', ParseIntPipe) id_publication: number,
    @Param('id_expert', ParseIntPipe) id_expert: number
  ): Promise<Commentaire[]> {
    return this.commentaireService.findByExpertAndPublication(id_publication, id_expert);
  }
}