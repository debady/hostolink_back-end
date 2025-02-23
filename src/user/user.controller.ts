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
      return { exists };
    } catch (error) {
      console.error('Erreur check-user:', error);
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

      return { message: 'Utilisateur créé avec succès' };
    } catch (error) {
      console.error('Erreur register-user:', error);
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

      return { message: 'Mot de passe défini avec succès' };
    } catch (error) {
      console.error('Erreur define-password:', error);
      throw new InternalServerErrorException('Erreur lors de la définition du mot de passe');
    }
  }

  // ✅ Récupère tous les utilisateurs
  @Get('users')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}


// import { 
//   Controller, 
//   Post, 
//   Body, 
//   BadRequestException, 
//   InternalServerErrorException, 
//   Get
// } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CheckUserDto } from './dto/check-user.dto';
// import { RegisterUserDto } from './dto/register-user.dto';

// @Controller('api')
// export class UserController {
//   constructor(private readonly userService: UserService) {}


//   // ✅ Récupère tous les utilisateurs
//     @Get('users')
//     async getAllUsers() {
//       return await this.userService.getAllUsers();
//     }


//   // ✅ Vérification de l'existence de l'utilisateur
//   @Post('check-user')
//   async checkUser(@Body() checkUserDto: CheckUserDto) {
//     try {
//       if (!checkUserDto.identifier) {
//         throw new BadRequestException('L’identifiant est requis');
//       }

//       const exists = await this.userService.checkUserExistence(checkUserDto.identifier);
//       return { exists };
//     } catch (error) {
//       console.error('Erreur check-user:', error);
//       throw new InternalServerErrorException('Erreur lors de la vérification de l\'utilisateur');
//     }
//   }

//   // ✅ Inscription automatique si l'utilisateur n'existe pas
//   @Post('register-user')
//   async registerUser(@Body() checkUserDto: CheckUserDto) {
//     try {
//       if (!checkUserDto.identifier) {
//         throw new BadRequestException('L’identifiant est requis');
//       }

//       const exists = await this.userService.checkUserExistence(checkUserDto.identifier);
//       if (exists) {
//         return {
//           success: false,
//           message: "L'utilisateur existe déjà. Veuillez vous connecter."
//         };
//       }

//       // Créer l'utilisateur sans mot de passe
//       await this.userService.createUserWithoutPassword(checkUserDto.identifier);
//       return {
//         success: true,
//         message: "Utilisateur inscrit, redirection vers la définition du mot de passe."
//       };
//     } catch (error) {
//       console.error('Erreur register-user:', error);
//       throw new InternalServerErrorException('Erreur lors de l\'inscription');
//     }
//   }

//   // ✅ Définir le mot de passe après l'inscription
//   @Post('set-password')
//   async setPassword(@Body() registerUserDto: RegisterUserDto) {
//     try {
//       if (!registerUserDto.identifier || !registerUserDto.password) {
//         throw new BadRequestException('L’identifiant et le mot de passe sont requis');
//       }

//       const success = await this.userService.setUserPassword(
//         registerUserDto.identifier,
//         registerUserDto.password
//       );

//       if (!success) {
//         return {
//           success: false,
//           message: "Utilisateur introuvable."
//         };
//       }

//       return {
//         success: true,
//         message: "Mot de passe défini avec succès."
//       };
//     } catch (error) {
//       console.error('Erreur set-password:', error);
//       throw new InternalServerErrorException('Erreur lors de la définition du mot de passe');
//     }
//   }
// }


// import { 
//   Controller, 
//   Post, 
//   Body, 
//   BadRequestException, 
//   InternalServerErrorException, 
//   Get
// } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CheckUserDto } from './dto/check-user.dto';
// import { RegisterUserDto } from './dto/register-user.dto';

// @Controller('api')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   // ✅ Vérifie si un utilisateur existe
//   @Post('check-user')
//   async checkUser(@Body() checkUserDto: CheckUserDto) {
//     try {
//       if (!checkUserDto.identifier) {
//         throw new BadRequestException('L’identifiant est requis');
//       }

//       const exists = await this.userService.checkUserExistence(checkUserDto.identifier);
//       return { exists };
//     } catch (error) {
//       console.error('Erreur check-user:', error);
//       throw new InternalServerErrorException('Erreur lors de la vérification de l\'utilisateur');
//     }
//   }

//   // ✅ Inscription avec un mot de passe
//   @Post('register-password')
//   async registerPassword(@Body() registerUserDto: RegisterUserDto) {
//     if (!registerUserDto.identifier || !registerUserDto.password) {
//       return {
//         success: false,
//         message: 'Identifiant et mot de passe sont obligatoires',
//       };
//     }
  
//     const success = await this.userService.registerUser(
//       registerUserDto.identifier,
//       registerUserDto.password,
//     );
  
//     if (!success) {
//       return {
//         success: false,
//         message: "L'utilisateur existe déjà",
//       };
//     }
  
//     return {
//       success: true,
//       message: 'Inscription réussie',
//     };
//   }

//   // ✅ Nouvelle route pour récupérer tous les utilisateurs
//   @Get('users')
//   async getAllUsers() {
//     return await this.userService.getAllUsers();
//   }
  
// }
