// import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
// import { PartageService } from './partage.service';
// import { Partage } from './entities/partage.entity';
// import { CreatePartageDto } from './dto/partage.dto';
// import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

// @Controller('partage')
// @UseGuards(AuthGuard)
// export class PartageController {
//   constructor(private readonly partageService: PartageService) {}

//   /**
//    * @route POST /partage
//    * @desc Crée un nouveau partage d'une publication
//    * @body CreatePartageDto (contient les infos sur l'auteur et la publication)
//    * @returns Le partage créé
//    */
//   @Post()
//   create(@Body() createPartageDto: CreatePartageDto): Promise<Partage> {
//     return this.partageService.create(createPartageDto);
//   }

//   /**
//    * @route GET /partage/publication/:id_publication
//    * @desc Récupère tous les partages associés à une publication donnée
//    * @param id_publication ID de la publication
//    * @returns Liste des partages
//    */
//   @Get('publication/:id_publication')
//   findByPublication(
//     @Param('id_publication', ParseIntPipe) id_publication: number,
//   ): Promise<Partage[]> {
//     return this.partageService.findByPublication(id_publication);
//   }

//   /**
//    * @route GET /partage/user/:id_user
//    * @desc Récupère tous les partages faits par un utilisateur donné
//    * @param id_user ID de l'utilisateur
//    * @returns Liste des partages
//    */
//   @Get('user/:id_user')
//   findByUser(
//     @Param('id_user') id_user: string,
//   ): Promise<Partage[]> {
//     return this.partageService.findByUser(id_user);
//   }

//   /**
//    * @route GET /partage/etablissement/:id_etablissement
//    * @desc Récupère les partages réalisés par un établissement de santé
//    * @param id_etablissement ID de l'établissement
//    * @returns Liste des partages
//    */
//   @Get('etablissement/:id_etablissement')
//   findByEtablissement(
//     @Param('id_etablissement', ParseIntPipe) id_etablissement: number,
//   ): Promise<Partage[]> {
//     return this.partageService.findByEtablissement(id_etablissement);
//   }

//   /**
//    * @route GET /partage/admin/:id_admin
//    * @desc Récupère les partages réalisés par un administrateur
//    * @param id_admin ID de l'administrateur
//    * @returns Liste des partages
//    */
//   @Get('admin/:id_admin')
//   findByAdmin(
//     @Param('id_admin', ParseIntPipe) id_admin: number,
//   ): Promise<Partage[]> {
//     return this.partageService.findByAdmin(id_admin);
//   }

//   /**
//    * @route GET /partage/expert/:id_expert
//    * @desc Récupère les partages réalisés par un expert de santé
//    * @param id_expert ID de l'expert
//    * @returns Liste des partages
//    */
//   @Get('expert/:id_expert')
//   findByExpert(
//     @Param('id_expert', ParseIntPipe) id_expert: number,
//   ): Promise<Partage[]> {
//     return this.partageService.findByExpert(id_expert);
//   }

//   /**
//    * @route GET /partage/shared/:uniqueId
//    * @desc Récupère une publication partagée à partir de son lien unique et incrémente automatiquement le compteur de clics
//    * @param uniqueId Identifiant unique du lien de partage
//    * @returns { partage, publication }
//    */
//   @Get('shared/:uniqueId')
//   async getSharedPublication(@Param('uniqueId') uniqueId: string) {
//     const partage = await this.partageService.findByUniqueId(uniqueId);
//     await this.partageService.incrementClics(partage.id_partage);
    
//     return {
//       partage,
//       publication: partage.publication,
//     };
//   }

//   /**
//    * @route GET /partage/count/publication/:id_publication
//    * @desc Récupère le nombre total de partages pour une publication donnée
//    * @param id_publication ID de la publication
//    * @returns Objet contenant { count }
//    */
//   @Get('count/publication/:id_publication')
//   async countByPublication(
//     @Param('id_publication', ParseIntPipe) id_publication: number,
//   ): Promise<{ count: number }> {
//     const count = await this.partageService.countByPublication(id_publication);
//     return { count };
//   }

//   /**
//    * @route GET /partage/stats/publication/:id_publication
//    * @desc Récupère des statistiques détaillées sur les partages d'une publication
//    * @param id_publication ID de la publication
//    * @returns Statistiques personnalisées (clics, sources, etc.)
//    */
//   @Get('stats/publication/:id_publication')
//   getPublicationShareStats(
//     @Param('id_publication', ParseIntPipe) id_publication: number,
//   ): Promise<any> {
//     return this.partageService.getPublicationShareStats(id_publication);
//   }
// }


import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { PartageService } from './partage.service';
import { Partage } from './entities/partage.entity';
import { CreatePartageDto } from './dto/partage.dto';
import { AuthGuard } from '@nestjs/passport'; // ✅ CORRIGÉ

@Controller('partage')
@UseGuards(AuthGuard('jwt')) // ✅ Spécifiez la stratégie
export class PartageController {
  constructor(private readonly partageService: PartageService) {}

  /**
   * @route POST /partage
   * @desc Crée un nouveau partage d'une publication
   * @body CreatePartageDto (contient les infos sur l'auteur et la publication)
   * @returns Le partage créé
   */
  @Post()
  create(@Body() createPartageDto: CreatePartageDto): Promise<Partage> {
    return this.partageService.create(createPartageDto);
  }

  /**
   * @route GET /partage/publication/:id_publication
   * @desc Récupère tous les partages associés à une publication donnée
   * @param id_publication ID de la publication
   * @returns Liste des partages
   */
  @Get('publication/:id_publication')
  findByPublication(
    @Param('id_publication', ParseIntPipe) id_publication: number,
  ): Promise<Partage[]> {
    return this.partageService.findByPublication(id_publication);
  }

  /**
   * @route GET /partage/user/:id_user
   * @desc Récupère tous les partages faits par un utilisateur donné
   * @param id_user ID de l'utilisateur
   * @returns Liste des partages
   */
  @Get('user/:id_user')
  findByUser(
    @Param('id_user') id_user: string,
  ): Promise<Partage[]> {
    return this.partageService.findByUser(id_user);
  }

  /**
   * @route GET /partage/etablissement/:id_etablissement
   * @desc Récupère les partages réalisés par un établissement de santé
   * @param id_etablissement ID de l'établissement
   * @returns Liste des partages
   */
  @Get('etablissement/:id_etablissement')
  findByEtablissement(
    @Param('id_etablissement', ParseIntPipe) id_etablissement: number,
  ): Promise<Partage[]> {
    return this.partageService.findByEtablissement(id_etablissement);
  }

  /**
   * @route GET /partage/admin/:id_admin
   * @desc Récupère les partages réalisés par un administrateur
   * @param id_admin ID de l'administrateur
   * @returns Liste des partages
   */
  @Get('admin/:id_admin')
  findByAdmin(
    @Param('id_admin', ParseIntPipe) id_admin: number,
  ): Promise<Partage[]> {
    return this.partageService.findByAdmin(id_admin);
  }

  /**
   * @route GET /partage/expert/:id_expert
   * @desc Récupère les partages réalisés par un expert de santé
   * @param id_expert ID de l'expert
   * @returns Liste des partages
   */
  @Get('expert/:id_expert')
  findByExpert(
    @Param('id_expert', ParseIntPipe) id_expert: number,
  ): Promise<Partage[]> {
    return this.partageService.findByExpert(id_expert);
  }

  /**
   * @route GET /partage/shared/:uniqueId
   * @desc Récupère une publication partagée à partir de son lien unique et incrémente automatiquement le compteur de clics
   * @param uniqueId Identifiant unique du lien de partage
   * @returns { partage, publication }
   */
  @Get('shared/:uniqueId')
  async getSharedPublication(@Param('uniqueId') uniqueId: string) {
    const partage = await this.partageService.findByUniqueId(uniqueId);
    await this.partageService.incrementClics(partage.id_partage);
    
    return {
      partage,
      publication: partage.publication,
    };
  }

  /**
   * @route GET /partage/count/publication/:id_publication
   * @desc Récupère le nombre total de partages pour une publication donnée
   * @param id_publication ID de la publication
   * @returns Objet contenant { count }
   */
  @Get('count/publication/:id_publication')
  async countByPublication(
    @Param('id_publication', ParseIntPipe) id_publication: number,
  ): Promise<{ count: number }> {
    const count = await this.partageService.countByPublication(id_publication);
    return { count };
  }

  /**
   * @route GET /partage/stats/publication/:id_publication
   * @desc Récupère des statistiques détaillées sur les partages d'une publication
   * @param id_publication ID de la publication
   * @returns Statistiques personnalisées (clics, sources, etc.)
   */
  @Get('stats/publication/:id_publication')
  getPublicationShareStats(
    @Param('id_publication', ParseIntPipe) id_publication: number,
  ): Promise<any> {
    return this.partageService.getPublicationShareStats(id_publication);
  }
}