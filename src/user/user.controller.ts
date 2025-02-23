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

  // ✅ Vérification de l’existence de l'utilisateur
  @Post('check-user')
  async checkUser(@Body() checkUserDto: CheckUserDto) {
    try {
      if (!checkUserDto.identifier) {
        throw new BadRequestException('L’identifiant est requis');
      }

      const exists = await this.userService.checkUserExistence(checkUserDto.identifier);
      console.log(`🔍 Vérification utilisateur : ${checkUserDto.identifier} - Existe: ${exists}`);

      return { exists };
    } catch (error) {
      console.error('❌ Erreur check-user:', error);
      throw new InternalServerErrorException('Erreur lors de la vérification de l\'utilisateur');
    }
  }

  // ✅ Création d'un utilisateur sans mot de passe s'il n'existe pas
  @Post('register-user')
  async registerUser(@Body() checkUserDto: CheckUserDto) {
    try {
      if (!checkUserDto.identifier) {
        throw new BadRequestException('L’identifiant est requis');
      }

      const success = await this.userService.createUserWithoutPassword(checkUserDto.identifier);

      if (!success) {
        throw new BadRequestException("L'utilisateur existe déjà");
      }

      console.log(`✅ Utilisateur créé sans mot de passe : ${checkUserDto.identifier}`);
      return { message: 'Utilisateur créé avec succès' };
    } catch (error) {
      console.error('❌ Erreur register-user:', error);
      throw new InternalServerErrorException('Erreur lors de la création de l\'utilisateur');
    }
  }

  // ✅ Définition du mot de passe après inscription
  @Post('define-password')
  async definePassword(@Body() registerUserDto: RegisterUserDto) {
    try {
      if (!registerUserDto.identifier || !registerUserDto.password) {
        throw new BadRequestException('Identifiant et mot de passe sont obligatoires');
      }

      const success = await this.userService.setUserPassword(
        registerUserDto.identifier,
        registerUserDto.password
      );

      if (!success) {
        throw new BadRequestException("L'utilisateur n'existe pas");
      }

      console.log(`🔒 Mot de passe défini pour ${registerUserDto.identifier}`);
      return { message: 'Mot de passe défini avec succès' };
    } catch (error) {
      console.error('❌ Erreur define-password:', error);
      throw new InternalServerErrorException('Erreur lors de la définition du mot de passe');
    }
  }

  // ✅ Vérifie le code de confirmation reçu par SMS ou email
  @Post('verify-code')
  async verifyCode(@Body() body: { identifier: string; code: string }) {
    try {
      if (!body.identifier || !body.code) {
        throw new BadRequestException('Identifiant et code requis');
      }

      const isValid = await this.userService.verifyConfirmationCode(body.identifier, body.code);
      console.log(`🔍 Vérification code pour ${body.identifier} : ${isValid ? 'Valide' : 'Incorrect'}`);

      if (!isValid) {
        return { success: false, message: 'Code incorrect' };
      }

      return { success: true, message: 'Code valide' };
    } catch (error) {
      console.error('❌ Erreur verify-code:', error);
      throw new InternalServerErrorException('Erreur de validation du code');
    }
  }

  // ✅ Vérifie le PIN de connexion
  @Post('verify-pin')
  async verifyPin(@Body() body: { identifier: string; pin: string }) {
    try {
      if (!body.identifier || !body.pin) {
        throw new BadRequestException('Identifiant et PIN requis');
      }

      const isValid = await this.userService.verifyUserPin(body.identifier, body.pin);
      console.log(`🔍 Vérification PIN pour ${body.identifier} : ${isValid ? 'Valide' : 'Incorrect'}`);

      if (!isValid) {
        return { success: false, message: 'PIN incorrect' };
      }

      return { success: true, message: 'PIN valide' };
    } catch (error) {
      console.error('❌ Erreur verify-pin:', error);
      throw new InternalServerErrorException('Erreur de validation du PIN');
    }
  }

  // ✅ Récupère tous les utilisateurs
  @Get('users')
  async getAllUsers() {
    try {
      const users = await this.userService.getAllUsers();
      console.log(`👥 Liste des utilisateurs récupérée (${users.length} utilisateurs)`);
      return users;
    } catch (error) {
      console.error('❌ Erreur getAllUsers:', error);
      throw new InternalServerErrorException('Erreur lors de la récupération des utilisateurs');
    }
  }
}
