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
import * as crypto from 'crypto';
import { Response } from 'express';

@Controller('wave-checkout')
export class WaveCheckoutController {
  constructor(private readonly waveService: WaveCheckoutService) {}

  // ✅ Créer une session de paiement
  @Post('session')
  async createSession(@Body() dto: CreateWaveSessionDto) {
    try {
      const session = await this.waveService.createSession(dto);
      return {
        success: true,
        message: 'Session créée avec succès',
        data: {
          sessionId: session.sessionId,
          checkoutUrl: session.waveLaunchUrl,
          amount: session.amount,
          currency: session.currency,
          clientReference: session.clientReference,
        }
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la création de session',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

@Post('webhook')
async handleWebhook(
  @Req() req: Request, 
  @Headers('authorization') authorization?: string 
) {
  try {
    const secret = process.env.WAVE_WEBHOOK_SECRET;

    console.log('🔍 Headers reçus:', req.headers);
    console.log('🔍 Authorization reçue:', authorization);
    console.log('🔍 Secret configuré:', secret ? 'Oui' : 'Non');

    if (!authorization || !secret) {
      console.error('❌ Authorization ou secret manquant');
      throw new HttpException('Authorization manquante', HttpStatus.UNAUTHORIZED);
    }

    // ✅ Wave envoie "Bearer {webhook_secret}"
    const expectedAuth = `Bearer ${secret}`;
    if (authorization !== expectedAuth) {
      console.error('❌ Authorization invalide');
      console.error('Attendue:', expectedAuth);
      console.error('Reçue:', authorization);
      throw new HttpException('Authorization invalide', HttpStatus.UNAUTHORIZED);
    }

    console.log('✅ Authorization webhook valide');

    // Parser le body et traiter l'événement
    const body = JSON.parse(req.body.toString());
    console.log('📨 Webhook reçu de Wave:', JSON.stringify(body, null, 2));

    // ✅ Traiter le webhook
    await this.waveService.handleWebhook(body);

    return { 
      success: true,
      message: 'Webhook traité avec succès',
      received: true 
    };

  } catch (error) {
    console.error('❌ Erreur webhook Wave:', error);
    return {
      success: false,
      error: error.message,
      received: true
    };
  }
}
  // ✅ Vérifier le statut d'une session (pour le frontend)
  @Get('session/:id')
  async getSession(@Param('id') sessionId: string) {
    try {
      const session = await this.waveService.findBySessionId(sessionId);
      if (!session) {
        throw new HttpException('Session non trouvée', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        data: {
          sessionId: session.sessionId,
          status: session.status,
          amount: session.amount,
          currency: session.currency,
          clientReference: session.clientReference,
          webhookReceived: session.webhookReceived,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
        }
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la récupération de session',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 🔍 Endpoint de test pour vérifier le statut d'un paiement par clientReference
  @Get('status/:clientReference')
  async getPaymentStatus(@Param('clientReference') clientReference: string) {
    try {
      // Rechercher par clientReference
      const session = await this.waveService.findByClientReference(clientReference);
      
      if (!session) {
        return {
          success: false,
          message: 'Paiement non trouvé',
          status: 'not_found'
        };
      }

      return {
        success: true,
        data: {
          status: session.status,
          amount: session.amount,
          currency: session.currency,
          webhookReceived: session.webhookReceived,
          isPaid: session.status === 'completed' && session.webhookReceived
        }
      };
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la vérification du statut',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  // ✅ Endpoint de debug temporaire - à retirer en production
@Post('webhook-debug')
async debugWebhook(@Req() req: Request) {
  console.log('🔍 Headers complets:', req.headers);
  console.log('🔍 Body type:', typeof req.body);
  console.log('🔍 Body content:', req.body);
  
  return { 
    received: true,
    headers: req.headers,
    bodyType: typeof req.body
  };
}
}

