import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  HttpException,
  HttpStatus,
  Headers,
  Req,
} from '@nestjs/common';
import { WaveCheckoutService } from './wave-checkout.service';
import { CreateWaveSessionDto } from './dto/create-wave-session.dto';
import { Request } from 'express';
import { Column } from 'typeorm';

@Controller('wave-checkout')
export class WaveCheckoutController {
  constructor(private readonly waveService: WaveCheckoutService) {}

  // ✅ Créer une session de paiement
  @Post('session')
  async createSession(@Body() dto: CreateWaveSessionDto) {
    const session = await this.waveService.createSession(dto);
    return {
      success: true,
      message: 'Session créée avec succès',
      session,
    };
  }

  // ✅ Webhook appelé par Wave à la fin du paiement
  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Headers('x-wave-signature') signature: string) {
    const body = req.body;

    const sessionId = body?.data?.id;
    const status = body?.event_type === 'checkout.session.completed' ? 'completed' : 'failed';

    if (!sessionId) {
      throw new HttpException('Session ID manquant', HttpStatus.BAD_REQUEST);
    }

    // 💡 TODO: Vérifier la validité de la signature Wave ici si possible

    await this.waveService.updateSessionStatus(sessionId, status);

    return { received: true };
  }

  // ✅ Vérifier le statut d'une session (optionnel)
  @Get('session/:id')
  async getSession(@Param('id') sessionId: string) {
    const session = await this.waveService.findBySessionId(sessionId);
    if (!session) {
      throw new HttpException('Session non trouvée', HttpStatus.NOT_FOUND);
    }
    return session;
  }

  @Column({ name: 'webhook_received', type: 'boolean', default: false })
  webhookReceived: boolean;
}
