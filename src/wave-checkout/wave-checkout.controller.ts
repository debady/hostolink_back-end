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
          checkoutUrl: `https://checkout.wave.com/checkout/${session.sessionId}`, 
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

  // ✅ Webhook appelé par Wave après paiement réussi - NOUVELLE LOGIQUE COMPLÈTE
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request, 
    @Headers('x-wave-signature') signature?: string
  ) {
    try {
      const body = req.body;

      // 📝 Log pour debugging
      console.log('📨 Webhook reçu de Wave:', JSON.stringify(body, null, 2));

      // 🔒 TODO: Vérifier la signature Wave pour la sécurité
      // if (signature) {
      //   const isValid = this.verifyWaveSignature(body, signature);
      //   if (!isValid) {
      //     throw new HttpException('Signature invalide', HttpStatus.UNAUTHORIZED);
      //   }
      // }

      // 🚀 Traiter le webhook avec la nouvelle logique complète
      await this.waveService.handleWebhook(body);

      return { 
        success: true,
        message: 'Webhook traité avec succès',
        received: true 
      };

    } catch (error) {
      console.error('❌ Erreur webhook Wave:', error);
      
      // 📤 Retourner un statut 200 pour éviter que Wave ne relance
      // mais logger l'erreur pour investigation
      return {
        success: false,
        error: error.message,
        received: true // Wave considère comme traité même si erreur
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
}


// import {
//   Controller,
//   Post,
//   Body,
//   Param,
//   Get,
//   HttpException,
//   HttpStatus,
//   Headers,
//   Req,
// } from '@nestjs/common';
// import { WaveCheckoutService } from './wave-checkout.service';
// import { CreateWaveSessionDto } from './dto/create-wave-session.dto';
// import { Request } from 'express';
// import { Column } from 'typeorm';

// @Controller('wave-checkout')
// export class WaveCheckoutController {
//   constructor(private readonly waveService: WaveCheckoutService) {}

//   // ✅ Créer une session de paiement
//   @Post('session')
//   async createSession(@Body() dto: CreateWaveSessionDto) {
//     const session = await this.waveService.createSession(dto);
//     return {
//       success: true,
//       message: 'Session créée avec succès',
//       session,
//     };
//   }

//   // // ✅ Webhook appelé par Wave à la fin du paiement
//   @Post('webhook')
//   async handleWebhook(@Req() req: Request, @Headers('x-wave-signature') signature: string) {
//     const body = req.body;

//     const sessionId = body?.data?.id;
//     const status = body?.event_type === 'checkout.session.completed' ? 'completed' : 'failed';

//     if (!sessionId) {
//       throw new HttpException('Session ID manquant', HttpStatus.BAD_REQUEST);
//     }

//     // 💡 TODO: Vérifier la validité de la signature Wave ici si possible

//     await this.waveService.updateSessionStatus(sessionId, status);

//     return { received: true };
//   }


//   // ✅ Vérifier le statut d'une session (optionnel)
//   @Get('session/:id')
//   async getSession(@Param('id') sessionId: string) {
//     const session = await this.waveService.findBySessionId(sessionId);
//     if (!session) {
//       throw new HttpException('Session non trouvée', HttpStatus.NOT_FOUND);
//     }
//     return session;
//   }

  


// }
