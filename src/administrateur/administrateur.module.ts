import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrateur } from './entities/administrateur.entity';
import { AdministrateurService } from './administrateur.service';
import { AdministrateurController } from './administrateur.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Administrateur]),
    ConfigModule, 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'defaultSecretKey', 
        signOptions: { expiresIn: '1d' }, 
      }),
    }),
  ],
  controllers: [AdministrateurController],
  providers: [AdministrateurService],
  exports: [AdministrateurService, JwtModule],
})
export class AdministrateurModule {}
