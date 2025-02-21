import { 
  Controller, 
  Post, 
  Body, 
  BadRequestException, 
  InternalServerErrorException, 
  Get
} from '@nestjs/common';
import { UserService } from './user.service';
import { CheckUserDto } from './dto/check-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ✅ Vérifie si un utilisateur existe
  @Post('check-user')
  async checkUser(@Body() checkUserDto: CheckUserDto) {
    try {
      if (!checkUserDto.identifier) {
        throw new BadRequestException('L’identifiant est requis');
      }

      const exists = await this.userService.checkUserExistence(checkUserDto.identifier);
      return { exists };
    } catch (error) {
      console.error('Erreur check-user:', error);
      throw new InternalServerErrorException('Erreur lors de la vérification de l\'utilisateur');
    }
  }

  // ✅ Inscription avec un mot de passe
  @Post('register-password')
  async registerPassword(@Body() registerUserDto: RegisterUserDto) {
    if (!registerUserDto.identifier || !registerUserDto.password) {
      return {
        success: false,
        message: 'Identifiant et mot de passe sont obligatoires',
      };
    }
  
    const success = await this.userService.registerUser(
      registerUserDto.identifier,
      registerUserDto.password,
    );
  
    if (!success) {
      return {
        success: false,
        message: "L'utilisateur existe déjà",
      };
    }
  
    return {
      success: true,
      message: 'Inscription réussie',
    };
  }

  // ✅ Nouvelle route pour récupérer tous les utilisateurs
  @Get('users')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
  
}
