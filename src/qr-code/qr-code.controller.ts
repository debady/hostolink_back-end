// src/qr-code/qr-code.controller.ts
import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('qr-code')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @UseGuards(JwtAuthGuard)
  @Get('utilisateur/:id/static')
  generateStaticQrCodeForUser(@Param('id') id: string) {
    return this.qrCodeService.generateStaticQrCodeForUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('utilisateur/:id/dynamic')
  generateDynamicQrCodeForUser(@Param('id') id: string) {
    return this.qrCodeService.generateDynamicQrCodeForUser(id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('etablissement/:id/static')
  // generateStaticQrCodeForEtablissement(@Param('id') id: string) {
  //   return this.qrCodeService.generateStaticQrCodeForEtablissement(+id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get('etablissement/:id/dynamic')
  // generateDynamicQrCodeForEtablissement(@Param('id') id: string) {
  //   return this.qrCodeService.generateDynamicQrCodeForEtablissement(+id);
  // }

  @Post('validate')
  validateQrCode(@Body() body: { token: string }) {
    return this.qrCodeService.validateQrCode(body.token);
  }
}


