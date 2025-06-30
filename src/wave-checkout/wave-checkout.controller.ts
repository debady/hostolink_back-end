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

//   // // ✅ Webhook appelé par Wave après paiement réussi - NOUVELLE LOGIQUE COMPLÈTE
//   // @Post('webhook')
//   // async handleWebhook(
//   //   @Req() req: Request, 
//   //   @Headers('x-wave-signature') signature?: string
//   // ) {
//   //   try {
//   //     const body = req.body;

//   //     // 📝 Log pour debugging
//   //     console.log('📨 Webhook reçu de Wave:', JSON.stringify(body, null, 2));

//   //     // 🔒 TODO: Vérifier la signature Wave pour la sécurité
//   //     // if (signature) {
//   //     //   const isValid = this.verifyWaveSignature(body, signature);
//   //     //   if (!isValid) {
//   //     //     throw new HttpException('Signature invalide', HttpStatus.UNAUTHORIZED);
//   //     //   }
//   //     // }

//   //     // 🚀 Traiter le webhook avec la nouvelle logique complète
//   //     await this.waveService.handleWebhook(body);

//   //     return { 
//   //       success: true,
//   //       message: 'Webhook traité avec succès',
//   //       received: true 
//   //     };

//   //   } catch (error) {
//   //     console.error('❌ Erreur webhook Wave:', error);
      
//   //     // 📤 Retourner un statut 200 pour éviter que Wave ne relance
//   //     // mais logger l'erreur pour investigation
//   //     return {
//   //       success: false,
//   //       error: error.message,
//   //       received: true // Wave considère comme traité même si erreur
//   //     };
//   //   }
//   // }

// //   @Post('webhook')
// // async handleWebhook(
// //   @Req() req: Request, 
// //   @Headers('authorization') authorization?: string
// // ) {
// //   try {
// //     const body = req.body;

// //     // 📝 Log pour debugging
// //     console.log('📨 Webhook reçu de Wave:', JSON.stringify(body, null, 2));

// //     // 🔒 Vérifier la signature Wave (SHARED_SECRET)
// //     const webhookSecret = process.env.WAVE_WEBHOOK_SECRET;
// //     if (webhookSecret && authorization) {
// //       const expectedAuth = `Bearer ${webhookSecret}`;
// //       if (authorization !== expectedAuth) {
// //         console.error('❌ Signature webhook invalide');
// //         throw new HttpException('Signature invalide', HttpStatus.UNAUTHORIZED);
// //       }
// //       console.log('✅ Signature webhook valide');
// //     }

// //     // 🚀 Traiter le webhook avec la nouvelle logique complète
// //     await this.waveService.handleWebhook(body);

// //     return { 
// //       success: true,
// //       message: 'Webhook traité avec succès',
// //       received: true 
// //     };

// //   } catch (error) {
// //     console.error('❌ Erreur webhook Wave:', error);
    
// //     return {
// //       success: false,
// //       error: error.message,
// //       received: true
// //     };
// //   }
// // }


// @Post('webhook')
// async handleWebhook(
//   @Req() req: Request,
//   @Headers('x-wave-signature') signature?: string
// ) {
//   try {
//     const secret = process.env.WAVE_WEBHOOK_SECRET;

//     if (!signature || !secret) {
//       console.error('❌ Signature ou secret manquant');
//       throw new HttpException('Signature manquante', HttpStatus.UNAUTHORIZED);
//     }

//     // ✅ Calculer le HMAC du raw body
//     const hmac = crypto.createHmac('sha256', secret);
//     hmac.update(req.body); // Buffer brut ici
//     const digest = hmac.digest('hex');

//     if (digest !== signature) {
//       console.error('❌ Signature webhook invalide');
//       throw new HttpException('Signature invalide', HttpStatus.UNAUTHORIZED);
//     }

//     console.log('✅ Signature webhook valide');

//     const parsedBody = JSON.parse(req.body.toString());

//     // 📨 Log pour debugging
//     console.log('📨 Webhook reçu de Wave:', JSON.stringify(parsedBody, null, 2));

//     // 🚀 Appeler le service avec le vrai payload
//     await this.waveService.handleWebhook(parsedBody);

//     return {
//       success: true,
//       message: 'Webhook traité avec succès',
//       received: true
//     };

//   } catch (error) {
//     console.error('❌ Erreur webhook Wave:', error);
//     return {
//       success: false,
//       error: error.message,
//       received: true // Toujours 200 même en erreur logique
//     };
//   }
// }

@Post('webhook')
  async handleWebhook(@Req() req: Request, @Headers('wave-signature') signature?: string) {
    const secret = process.env.WAVE_WEBHOOK_SECRET;
    if (!signature || !secret) {
      console.error('❌ Signature ou secret manquant');
      throw new HttpException('Signature manquante', HttpStatus.UNAUTHORIZED);
    }

    const [timestampPart, ...signatureParts] = signature.split(',');
    const timestamp = timestampPart.split('=')[1];
    const signatures = signatureParts.map(part => part.split('=')[1]);

    if (!timestamp || signatures.length === 0) {
      console.error('❌ Signature invalide');
      throw new HttpException('Signature invalide', HttpStatus.UNAUTHORIZED);
    }

    const payload = req.body as Buffer;
    const signedPayload = timestamp + payload.toString();
    const expectedHmac = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex');

    if (!signatures.includes(expectedHmac)) {
      console.error('❌ Signature invalide');
      throw new HttpException('Signature invalide', HttpStatus.UNAUTHORIZED);
    }

    console.log('✅ Signature valide');

  // Parser body et traiter l’événement
  // const body = JSON.parse(payloadBuffer.toString());
  // console.log('📨 Webhook reçu de Wave:', body);

  // await this.waveService.handleWebhook(body);
  return { received: true };
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
}

