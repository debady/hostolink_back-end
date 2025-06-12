import { Body, Controller, Get, Param, ParseIntPipe, Post, Logger, UseGuards, ValidationPipe, UsePipes, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { Publication } from './entities/publication.entity';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { JwtAdminGuard, JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { CreatePublicationDto } from './dto/create-publication.dto';

@Controller('publication')
@UseGuards(JwtAuthGuard)
export class PublicationController {
  private readonly logger = new Logger(PublicationController.name);

  constructor(private readonly publicationService: PublicationService) {}


   @Post('create')
   @UseGuards(JwtAuthGuard)
      @UseInterceptors(FileInterceptor('image'))
      async createPublication(
      @UploadedFile() image: Express.Multer.File,
    @Body() body: any
  ) {
    return this.publicationService.create(body, image);
  }


  @Get('recupations')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Publication[]> {
    return this.publicationService.findAll();
  }

  @Get(':id')
     @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Publication> {
    return this.publicationService.findOne(id);
  }

  // Récupérer les publications par utilisateur
  @Get('user/:id_user')
  async findByUser(@Param('id_user') id_user: string): Promise<Publication[]> {
    return this.publicationService.findByUser(id_user);
  }

  // Récupérer les publications par établissement
  @Get('etablissement/:id_etablissement')
  async findByEtablissement(@Param('id_etablissement', ParseIntPipe) id_etablissement: number): Promise<Publication[]> {
    return this.publicationService.findByEtablissement(id_etablissement);
  }

  // Récupérer les publications par admin
  @Get('admin/:id_admin')
  async findByAdmin(@Param('id_admin', ParseIntPipe) id_admin: number): Promise<Publication[]> {
    return this.publicationService.findByAdmin(id_admin);
  }

  // Récupérer les publications par expert
  @Get('expert/:id_expert')
  async findByExpert(@Param('id_expert', ParseIntPipe) id_expert: number): Promise<Publication[]> {
    return this.publicationService.findByExpert(id_expert);
  }


  // liké une publication
  @Post(':id/like')
     @UseGuards(JwtAuthGuard)
  async likePost(@Param('id', ParseIntPipe) id: number): Promise<Publication> {
    return this.publicationService.likePost(id);
  }


  // disliké une publication
  @Post(':id/dislike')
     @UseGuards(JwtAuthGuard)
  async dislikePost(@Param('id', ParseIntPipe) id: number): Promise<Publication> {
    return this.publicationService.dislikePost(id);
  }


  // Récupérer les likes d'une publication par l'id de la publication
  @Get(':id/likes/count')
@UseGuards(JwtAuthGuard)
async getLikesCount(@Param('id', ParseIntPipe) id: number): Promise<{ compteur_like: number }> {
  return this.publicationService.getLikesCount(id);
}


}



