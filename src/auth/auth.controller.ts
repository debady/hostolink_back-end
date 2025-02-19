import { Controller, Post, Body, Get, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckUserDto } from './dto/check-user.dto';
import { Utilisateur } from './entities/utilisateur.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  getHome() {
    return { message: 'Bienvenue sur l’API de HostoLink ! 🚀' };
  }

  @Get('/users')
  async getUsers(): Promise<Omit<Utilisateur, 'mdp'>[]> {
    return await this.authService.getAllUsers();
  }

  @Post('check-user')
  async checkUser(@Body() checkUserDto: CheckUserDto) {
    const exists = await this.authService.checkUserExists(checkUserDto);
    return { exists };
  }

  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.registerUser(registerUserDto);
  }

  @Post('/login')
  @HttpCode(200) 
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.loginUser(loginUserDto);
  }
}
