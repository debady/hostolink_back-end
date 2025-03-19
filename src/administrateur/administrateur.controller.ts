import { 
  Controller, 
  Post, 
  Body, 
  HttpException, 
  HttpStatus, 
  Get,
  UseGuards,
  Request
} from '@nestjs/common';
import { CreateAdministrateurDto } from './dto/create-administrateur.dto';
import { AdministrateurService } from './administrateur.service';
import { LoginAdministrateurDto } from './dto/login-administrateur.dto';
import { JwtAdminGuard } from '../auth/jwt-auth.guard';  // Vérifie bien ce chemin

@Controller('administrateurs')
export class AdministrateurController {
  constructor(private readonly adminService: AdministrateurService) {}

  @Post('inscription')
  async inscrireAdmin(@Body() dto: CreateAdministrateurDto) {
    try {
      return await this.adminService.inscrireAdministrateur(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() dto: LoginAdministrateurDto) {
    try {
      return await this.adminService.connexionAdministrateur(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
  
  @Get('me')
  @UseGuards(JwtAdminGuard)
  getMe(@Request() req) {
    return req.user;
  }
}
