import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller'; // ✅ Ajout du contrôleur

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' }, // ⏳ Expiration du token
      }),
    }),
  ],
  controllers: [AuthController], // ✅ Ajout du contrôleur ici
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}

