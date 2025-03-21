import { Controller, Post, Body, Param, Put, Delete, Get } from '@nestjs/common';
import { AnnonceService } from './annonce.service';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { UpdateAnnonceDto } from './dto/update-annoce.dto';

@Controller('annonces')
export class AnnonceController {
  constructor(private readonly annonceService: AnnonceService) {}

  @Post()
  async createAnnonce(@Body() dto: CreateAnnonceDto) {
    return this.annonceService.createAnnonce(dto);
  }
  @Get()
  async getAllAnnonces() {
    return this.annonceService.getAllAnnonces();
  }

  
  @Put(':id')
  async updateAnnonce(@Param('id') id: number, @Body() dto: UpdateAnnonceDto) {
    return this.annonceService.updateAnnonce(id, dto);
  }
 
  @Delete(':id')
  async deleteAnnonce(@Param('id') id: number) {
    return this.annonceService.deleteAnnonce(id);
  }

}
