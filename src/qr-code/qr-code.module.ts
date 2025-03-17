import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { QrCodeController } from './qr-code.controller';
import { QrCodeService } from './qr-code.service';
import { QrCodeStatique } from './entitie/qr_code_statique.entity';
import { QrCodeDynamique } from './entitie/qr_code_dynamique.entity';
import { EtablissementModule } from 'src/user_etablissement_sante/user_etablissement_sante.module';
import { QrCodeJwtService } from './qr-code-jwt/qr-code-jwt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QrCodeStatique, QrCodeDynamique]),
    JwtModule.register({}),
    ConfigModule,
    EtablissementModule,
  ],
  controllers: [QrCodeController],
  providers: [QrCodeService, QrCodeJwtService],
  exports: [QrCodeService, QrCodeJwtService]
})
export class QrCodeModule {}