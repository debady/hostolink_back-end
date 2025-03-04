import { 
  Controller, 
  Post, 
  Body, 
  BadRequestException, 
  InternalServerErrorException, 
  Get, 
  UseGuards,
  Req
} from '@nestjs/common';
import { UserService } from './user.service';
import { CheckUserDto } from './dto/check-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { OtpService } from '../otp/otp.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { id_user: number };
}

@Controller('api')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService
  ) {}

  // ✅ Vérification de l’existence de l'utilisateur
  @Post('check-user')
  async checkUser(@Body() checkUserDto: CheckUserDto) {
    if (!checkUserDto.identifier) {
      throw new BadRequestException('L’identifiant est requis');
    }
    const exists = await this.userService.checkUserExistence(checkUserDto.identifier.trim());
    return { success: true, exists, identifier: checkUserDto.identifier.trim() };
  }

  // ✅ Création d'un utilisateur (sans mot de passe)
  @Post('register-user')
  async registerUser(@Body() checkUserDto: CheckUserDto) {
    if (!checkUserDto.identifier) {
      throw new BadRequestException('L’identifiant est requis');
    }
    return await this.userService.registerUser(checkUserDto.identifier.trim());
  }

  // ✅ Définition du mot de passe après inscription
  @Post('define-password')
  async definePassword(@Body() registerUserDto: RegisterUserDto) {
    if (!registerUserDto.identifier || !registerUserDto.password) {
      throw new BadRequestException('Identifiant et mot de passe sont obligatoires');
    }

    // Vérifier si l'utilisateur existe
    const userExists = await this.userService.checkUserExistence(registerUserDto.identifier.trim());

    if (!userExists) {
      throw new BadRequestException("L'utilisateur n'existe pas");
    }

    // Définir le mot de passe
    const success = await this.userService.setUserPassword(
      registerUserDto.identifier.trim(),
      registerUserDto.password.trim()
    );

    if (!success) {
      throw new InternalServerErrorException("Échec de la mise à jour du mot de passe.");
    }

    return { success: true, message: 'Mot de passe défini avec succès' };
  }

  // ✅ Vérification du PIN de connexion
  @Post('verify-pin')
  async verifyPin(@Body() body: { identifier: string; pin: string }) {
    if (!body.identifier || !body.pin) {
      throw new BadRequestException('Identifiant et PIN requis');
    }
    const isValid = await this.userService.verifyUserPin(body.identifier.trim(), body.pin.trim());
    if (!isValid) {
      return { success: false, message: 'PIN incorrect ou non défini' };
    }
    return { success: true, message: 'PIN valide' };
  }

  // ✅ Générer un OTP
  @Post('generate-otp')
  async generateOtp(@Body() body: { identifier: string }) {
    if (!body.identifier) {
      throw new BadRequestException("L'identifiant est requis");
    }
    try {
      const result = await this.otpService.generateOtp(body.identifier.trim());
      return { success: true, message: "OTP généré avec succès", otp: result.otp }; 
    } catch (error) {
      console.error("❌ Erreur generate-otp:", error);
      throw new InternalServerErrorException(error.message || "Erreur lors de la génération de l'OTP");
    }
  }

  // ✅ Vérifier un OTP
  @Post('verify-otp')
  async verifyOtp(@Body() body: { identifier: string; otpCode: string }) {
    if (!body.identifier || !body.otpCode) {
      throw new BadRequestException("Identifiant et code OTP requis");
    }
    try {
      const result = await this.otpService.verifyOtp(body.identifier.trim(), body.otpCode.trim());
      return result;
    } catch (error) {
      console.error("❌ Erreur verify-otp:", error);
      throw new InternalServerErrorException(error.message || "Erreur lors de la vérification de l'OTP");
    }
  }

  // ✅ Récupérer tous les utilisateurs
  @Get('users')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  // ✅ Récupérer les infos de l'utilisateur connecté
  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.userService.getUserById(req.user.id_user);
  }
}



// import { 
//   Controller, 
//   Post, 
//   Body, 
//   BadRequestException, 
//   InternalServerErrorException, 
//   Get, 
//   UseGuards,
//   Req
// } from '@nestjs/common';
// import { UserService } from './user.service';
// import { CheckUserDto } from './dto/check-user.dto';
// import { RegisterUserDto } from './dto/register-user.dto';
// import { OtpService } from '../otp/otp.service';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { Request } from 'express';

// interface AuthenticatedRequest extends Request {
//   user: { id_user: number };
// }

// @Controller('api')
// export class UserController {
//   constructor(
//     private readonly userService: UserService,
//     private readonly otpService: OtpService
//   ) {}

//   // ✅ Vérification de l’existence de l'utilisateur
//   @Post('check-user')
//   async checkUser(@Body() checkUserDto: CheckUserDto) {
//     if (!checkUserDto.identifier) {
//       throw new BadRequestException('L’identifiant est requis');
//     }
//     const exists = await this.userService.checkUserExistence(checkUserDto.identifier.trim());
//     return { success: true, exists, identifier: checkUserDto.identifier.trim() };
//   }

//   // ✅ Création d'un utilisateur (sans mot de passe)
//   @Post('register-user')
//   async registerUser(@Body() checkUserDto: CheckUserDto) {
//     if (!checkUserDto.identifier) {
//       throw new BadRequestException('L’identifiant est requis');
//     }
//     return await this.userService.registerUser(checkUserDto.identifier.trim());
//   }

//   // ✅ Définition du mot de passe après inscription
//   @Post('define-password')
//   async definePassword(@Body() registerUserDto: RegisterUserDto) {
//     if (!registerUserDto.identifier || !registerUserDto.password) {
//       throw new BadRequestException('Identifiant et mot de passe sont obligatoires');
//     }

//     // Vérifier si l'utilisateur existe
//     const userExists = await this.userService.checkUserExistence(registerUserDto.identifier.trim());

//     if (!userExists) {
//       throw new BadRequestException("L'utilisateur n'existe pas");
//     }

//     // Définir le mot de passe
//     const success = await this.userService.setUserPassword(
//       registerUserDto.identifier.trim(),
//       registerUserDto.password.trim()
//     );

//     if (!success) {
//       throw new InternalServerErrorException("Échec de la mise à jour du mot de passe.");
//     }

//     return { success: true, message: 'Mot de passe défini avec succès' };
//   }


//   // ✅ Vérification du PIN de connexion
//   @Post('verify-pin')
//   async verifyPin(@Body() body: { identifier: string; pin: string }) {
//     if (!body.identifier || !body.pin) {
//       throw new BadRequestException('Identifiant et PIN requis');
//     }
//     const isValid = await this.userService.verifyUserPin(body.identifier.trim(), body.pin.trim());
//     if (!isValid) {
//       return { success: false, message: 'PIN incorrect ou non défini' };
//     }
//     return { success: true, message: 'PIN valide' };
//   }

//   // ✅ Générer un OTP
//   @Post('generate-otp')
//   async generateOtp(@Body() body: { identifier: string }) {
//     if (!body.identifier) {
//       throw new BadRequestException("L'identifiant est requis");
//       return await this.otpService.generateOtp(body.identifier.trim());

//     }
//     try {
//       const result = await this.otpService.generateOtp(body.identifier.trim());
//       return { success: true, message: "OTP généré avec succès", otp: result.otp }; 
//     } catch (error) {
//       console.error("❌ Erreur generate-otp:", error);
//       throw new InternalServerErrorException(error.message || "Erreur lors de la génération de l'OTP");
//     }
//   }

//   // ✅ Vérifier un OTP
//   @Post('verify-otp')
//   async verifyOtp(@Body() body: { identifier: string; otpCode: string }) {
//     if (!body.identifier || !body.otpCode) {
//       throw new BadRequestException("Identifiant et code OTP requis");
//       return await this.otpService.verifyOtp(body.identifier.trim(), body.otpCode.trim());
//     }
//     try {
//       const result = await this.otpService.verifyOtp(body.identifier.trim(), body.otpCode.trim());
//       return result;
//     } catch (error) {
//       console.error("❌ Erreur verify-otp:", error);
//       throw new InternalServerErrorException(error.message || "Erreur lors de la vérification de l'OTP");
//     }
//   }

//   // ✅ Récupérer tous les utilisateurs
//   @Get('users')
//   async getAllUsers() {
//     return await this.userService.getAllUsers();
//   }

//   // ✅ Récupérer les infos de l'utilisateur connecté
//   @Get('user/me')
//   @UseGuards(JwtAuthGuard)
//   async getMe(@Req() req: AuthenticatedRequest) {
//     return this.userService.getUserById(req.user.id_user);
//   }
  
// }
