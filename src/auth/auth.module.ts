import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy'; // Cette stratégie doit gérer le UUID
import { UserModule } from '../utilisateur/user.module'; // Assurez-vous que UserModule est bien importé
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'; 

@Module({
  imports: [
    ConfigModule, // Pour récupérer la configuration depuis .env
    UserModule, // UserModule doit être bien configuré pour gérer l'UUID
    PassportModule.register({ defaultStrategy: 'jwt' }), // Utilisation de la stratégie par défaut : JWT
    JwtModule.registerAsync({
      imports: [ConfigModule], // Récupère la configuration via ConfigModule
      inject: [ConfigService], 
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Clé secrète pour signer les JWT
        signOptions: { expiresIn: '1h' }, // Temps d'expiration du token (1h)
      }),
    }),
  ],
  controllers: [AuthController], // Gestion des routes d'authentification
  providers: [AuthService, JwtStrategy], // AuthService pour valider l'utilisateur et JwtStrategy pour la vérification JWT
  exports: [AuthService, JwtStrategy, PassportModule, JwtModule], // Exporte les services pour les utiliser ailleurs
})
export class AuthModule {}
