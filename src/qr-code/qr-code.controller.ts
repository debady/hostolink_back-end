// ----------------------
// Contrôleur QR Code
// ----------------------
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';

@Controller('qr-codes')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Get('etablissement/:id/static')
  generateStaticQrCodeForEtablissement(@Param('id') id: string) {
    return this.qrCodeService.generateStaticQrCodeForEtablissement(+id);
  }

  @Get('etablissement/:id/dynamic')
  generateDynamicQrCodeForEtablissement(@Param('id') id: string) {
    return this.qrCodeService.generateDynamicQrCodeForEtablissement(+id);
  }

  @Post('validate')
  validateQrCode(@Body() body: { token: string }) {
    return this.qrCodeService.validateQrCode(body.token);
  }
}