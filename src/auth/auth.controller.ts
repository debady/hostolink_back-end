import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  HttpCode, 
  UseGuards, 
  Request, 
  UseInterceptors, 
  UploadedFile 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckUserDto } from './dto/check-user.dto';
import { Utilisateur } from './entities/utilisateur.entity';
import { RegisterUserDto, RegisterUsersDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ✅ Récupération du profil utilisateur après connexion
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    console.log("📥 Requête reçue pour récupérer le profil utilisateur.");
    console.log("🔑 Utilisateur connecté :", req.user);

    return this.authService.getUserProfile(req.user.id);
  }

  // ✅ Route d'accueil
  @Get('/')
  getHome() {
    return { message: 'Bienvenue sur l’API de HostoLink ! 🚀' };
  }

  // ✅ Récupérer tous les utilisateurs
  @Get('/users')
  async getUsers(): Promise<Omit<Utilisateur, 'mdp'>[]> {
    return await this.authService.getAllUsers();
  }

  // ✅ Vérifier si un utilisateur existe avant inscription
  @Post('check-user')
  async checkUser(@Body() checkUserDto: CheckUserDto) {
    const exists = await this.authService.checkUserExists(checkUserDto);
    return { exists };
  }

  // ✅ Inscription **multiple** (plusieurs utilisateurs en une requête)
  @Post('register/bulk')
  async registerBulk(@Body() registerUsersDto: RegisterUsersDto) {
    console.log("📥 Inscription multiple reçue :", registerUsersDto.users.length, "utilisateurs.");
    return await this.authService.registerMultiple(registerUsersDto.users);
  }

  // ✅ Inscription avec image de profil (upload)
  @Post('/register')
  @UseInterceptors(FileInterceptor('photo', {
    storage: diskStorage({
      destination: './uploads/profile_pics', // ✅ Dossier de stockage local
      filename: (req, file, callback) => {
        const validExtensions = ['.jpg', '.jpeg', '.png'];
        const fileExt = extname(file.originalname).toLowerCase();

        if (!validExtensions.includes(fileExt)) {
          return callback(new Error('Format d’image non supporté. Utilisez JPG ou PNG.'), '');
        }

        // ✅ Générer un nom unique pour l'image
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, `${uniqueSuffix}${fileExt}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.startsWith('image/')) {
        console.log("❌ Fichier non valide !");
        return callback(new Error('Seuls les fichiers images sont acceptés'), false);
      }
      callback(null, true);
    },
  }))
  async register(
    @Body() registerUserDto: RegisterUserDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    console.log("📥 Inscription reçue avec image :", photo ? photo.filename : "Aucune image");
    return await this.authService.registerUser(registerUserDto, photo);
  }

  // ✅ Connexion d'un utilisateur
  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }
}
