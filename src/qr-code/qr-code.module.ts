// src/qr-code/qr-code.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { QrCodeController } from './qr-code.controller';
import { QrCodeService } from './qr-code.service';
import { QrCodeStatique } from './entitie/qr_code_statique.entity';
import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';
import { UserModule } from 'src/utilisateur/user.module';
import { QrCodeJwtService } from './qr-code-jwt/qr-code-jwt.service';
import { CompteModule } from 'src/compte/compte.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QrCodeStatique, QrCodeDynamique]),
    JwtModule.register({}),
    ConfigModule,
    UserModule,
    // EtablissementModule,
    CompteModule,
  ],
  controllers: [QrCodeController],
  providers: [QrCodeService, QrCodeJwtService],
  exports: [QrCodeService, QrCodeJwtService]
})
export class QrCodeModule {}


