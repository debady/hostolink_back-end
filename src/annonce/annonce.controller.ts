import { Controller, Post, Body, Param, Put, Delete, Get, UseGuards } from '@nestjs/common';
import { AnnonceService } from './annonce.service';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { UpdateAnnonceDto } from './dto/update-annoce.dto';
import { JwtAdminGuard } from 'src/auth/jwt-auth.guard';

@Controller('annonces')
export class AnnonceController {
  constructor(private readonly annonceService: AnnonceService) {}

  @Post()
  // @UseGuards(JwtAdminGuard) 
  async createAnnonce(@Body() dto: CreateAnnonceDto) {
    console.log(`📩 annonce creer avec succès `);
    return this.annonceService.createAnnonce(dto);
  }
  @Get()
  // @UseGuards(JwtAdminGuard) 
  async getAllAnnonces() {
    console.log(`📩 tous recup annonce `);
    return this.annonceService.getAllAnnonces();
  }

  
  @Put(':id')
  // @UseGuards(JwtAdminGuard) 
  async updateAnnonce(@Param('id') id: number, @Body() dto: UpdateAnnonceDto) {
    return this.annonceService.updateAnnonce(id, dto);
  }
 
  @Delete(':id')
  // @UseGuards(JwtAdminGuard) 
  async deleteAnnonce(@Param('id') id: number) {
    return this.annonceService.deleteAnnonce(id);
  }

}
