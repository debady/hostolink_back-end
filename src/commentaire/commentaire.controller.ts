
import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CommentaireService } from './commentaire.service';
import { CreateCommentaireDto } from './dto/create-commentaire.dto';
import { Commentaire } from './entities/commentaire.entity';

@Controller('commentaire')
export class CommentaireController {
  constructor(private readonly commentaireService: CommentaireService) {}
  
  @Post()
  create(@Body() createCommentaireDto: CreateCommentaireDto): Promise<Commentaire> {
    return this.commentaireService.create(createCommentaireDto);
  }
  
  // Récupérer les commentaires d'un utilisateur spécifique sur une publication spécifique
  @Get('publication/:id_publication/user/:id_user')
  findByPublicationIdAndUserId(
    @Param('id_publication', ParseIntPipe) id_publication: number,
    @Param('id_user', ParseIntPipe) id_user: number,
  ): Promise<Commentaire[]> {
    return this.commentaireService.findByPublicationIdAndUserId(id_publication, id_user);
  }
  
  // Récupérer tous les commentaires d'une publication
  @Get('publication/:id_publication')
  findByPublicationId(
    @Param('id_publication', ParseIntPipe) id_publication: number,
  ): Promise<Commentaire[]> {
    return this.commentaireService.findByPublicationId(id_publication);
  }
}

 
