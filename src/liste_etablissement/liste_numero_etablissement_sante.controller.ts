import { Controller, Post, Body, Get, Param, UseInterceptors, UploadedFile, Query, NotFoundException, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ListeNumeroEtablissementSanteService } from './liste_numero_etablissement_sante.service';
import { CreateListeNumeroVertEtablissementSanteDto } from './dto/create-liste-numero-vert-etablissement-sante.dto';
import { ResponseListeNumeroVertEtablissementSanteDto } from './dto/response_liste_numero_vert_etablissement_sante.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/upload/cloudinary.service';



@Controller('liste-numero-vert')
export class ListeNumeroEtablissementSanteController {
  listeNumeroRepo: any;
  listeNumeroEtablissementSanteService: any;

  constructor(private readonly listeService: ListeNumeroEtablissementSanteService,
    private readonly cloudinaryService: CloudinaryService, ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
      @UploadedFile() file: Express.Multer.File,
      @Body() dto: CreateListeNumeroVertEtablissementSanteDto,
  ) {
      let imageUrl = dto.image; // Conserve l'image si déjà fournie
  
      if (file) {
          imageUrl = await this.cloudinaryService.uploadImage(file); // Upload si image envoyée
      }
  
      return await this.listeService.create({ ...dto, image: imageUrl });
  }
  
  
  // ✅ Récupérer tous les numéros verts
  @Get()
  async findAll(): Promise<ResponseListeNumeroVertEtablissementSanteDto[]> {
    return this.listeService.findAll();
  }

 // ✅ Endpoint pour filtrer par catégorie
 @Get('categorie')
 async findByCategory(
   @Query('categorie') categorie: string
 ): Promise<ResponseListeNumeroVertEtablissementSanteDto[]> {
   return this.listeService.findByCategory(categorie);
 }

  // ✅ Récupérer un numéro vert par ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.listeService.findOne(id);
  }

 
  
}




































































// import { Controller, Post, Get, Put, Patch, Delete, Param, Body } from '@nestjs/common';
// import { ListeNumeroVertEtablissementSanteService } from './liste_numero_etablissement_sante.service';
// import { CreateListeNumeroVertEtablissementSanteDto } from './dto/create-liste-numero-vert-etablissement-sante.dto';
// import { UpdateListeNumeroVertEtablissementSanteDto } from './dto/update-liste-numero-vert-etablissement-sante.dto';

// @Controller('liste-numero-vert-etablissement-sante')
// export class ListeNumeroVertEtablissementSanteController {
//   constructor(private readonly listeNumeroVertService: ListeNumeroVertEtablissementSanteService) {}

//   @Post()
//   async create(@Body() createListeNumeroVertDto: CreateListeNumeroVertEtablissementSanteDto) {
//     return this.listeNumeroVertService.create(createListeNumeroVertDto);
//   }

//   @Get()
//   async findAll() {
//     return this.listeNumeroVertService.findAll();
//   }

//   @Get(':id')
//   async findOne(@Param('id') id: number) {
//     return this.listeNumeroVertService.findOne(id);
//   }

//   @Get('/categorie/:type')
//   async findByCategory(@Param('type') type: string) {
//     return this.listeNumeroVertService.findByCategory(type);
//   }

//   @Put(':id')
//   async update(@Param('id') id: number, @Body() updateListeNumeroVertDto: UpdateListeNumeroVertEtablissementSanteDto) {
//     return this.listeNumeroVertService.update(id, updateListeNumeroVertDto);
//   }

//   @Patch(':id')
//   async partialUpdate(@Param('id') id: number, @Body() updateListeNumeroVertDto: UpdateListeNumeroVertEtablissementSanteDto) {
//     return this.listeNumeroVertService.partialUpdate(id, updateListeNumeroVertDto);
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: number) {
//     return this.listeNumeroVertService.remove(id);
//   }
// }
