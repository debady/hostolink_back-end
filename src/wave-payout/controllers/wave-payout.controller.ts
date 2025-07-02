import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WavePayoutService } from '../services/wave-payout.service';
import { 
  CreatePayoutDto, 
  PayoutResponseDto, 
  PayoutStatusDto, 
  ConfigureWaveDto,
  VerifyWaveOtpDto,
  WaveConfigResponseDto 
} from '../dto/wave-payout.dto';

@Controller('wave-payout')
export class WavePayoutController {
  constructor(private readonly payoutService: WavePayoutService) {}

  // 🚀 Créer un retrait Wave pour un établissement
  @Post('withdraw/:etablissementId')
  async createPayout(
    @Param('etablissementId') etablissementId: string,
    @Body() dto: CreatePayoutDto
  ): Promise<PayoutResponseDto> {
    try {
      const etablissementIdNum = parseInt(etablissementId);
      
      if (isNaN(etablissementIdNum)) {
        throw new HttpException('ID établissement invalide', HttpStatus.BAD_REQUEST);
      }

      const result = await this.payoutService.createPayout(etablissementIdNum, dto);

      return {
        success: true,
        message: 'Retrait Wave initié avec succès',
        data: result
      };

    } catch (error) {
      console.error('❌ Erreur controller retrait:', error);
      
      return {
        success: false,
        message: error.message || 'Erreur lors du retrait Wave',
        error: error.message
      };
    }
  }

  // 📊 Vérifier le statut d'un retrait
  @Get('status/:payoutId')
  async getPayoutStatus(@Param('payoutId') payoutId: string): Promise<PayoutStatusDto> {
    try {
      const status = await this.payoutService.getPayoutStatus(payoutId);

      return {
        success: true,
        data: status
      };

    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération du statut'
      };
    }
  }

  // 📜 Historique des retraits d'un établissement
  @Get('history/:etablissementId')
  async getPayoutHistory(@Param('etablissementId') etablissementId: string) {
    try {
      const etablissementIdNum = parseInt(etablissementId);
      
      if (isNaN(etablissementIdNum)) {
        throw new HttpException('ID établissement invalide', HttpStatus.BAD_REQUEST);
      }

      const history = await this.payoutService.getPayoutHistory(etablissementIdNum);

      return {
        success: true,
        message: 'Historique récupéré avec succès',
        data: history
      };

    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la récupération de l\'historique',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 🔍 Informations sur les limites de retrait d'un établissement
  @Get('limits/:etablissementId')
  async getWithdrawLimits(@Param('etablissementId') etablissementId: string) {
    try {
      const etablissementIdNum = parseInt(etablissementId);
      
      if (isNaN(etablissementIdNum)) {
        throw new HttpException('ID établissement invalide', HttpStatus.BAD_REQUEST);
      }

      const limits = await this.payoutService.getWithdrawLimits(etablissementIdNum);
      
      return {
        success: true,
        message: 'Limites récupérées avec succès',
        data: limits
      };

    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la récupération des limites',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 💰 Solde disponible pour retrait d'un établissement
  @Get('balance/:etablissementId')
  async getAvailableBalance(@Param('etablissementId') etablissementId: string) {
    try {
      const etablissementIdNum = parseInt(etablissementId);
      
      if (isNaN(etablissementIdNum)) {
        throw new HttpException('ID établissement invalide', HttpStatus.BAD_REQUEST);
      }

      const balance = await this.payoutService.getAvailableBalance(etablissementIdNum);
      
      return {
        success: true,
        message: 'Solde récupéré avec succès',
        data: balance
      };

    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la récupération du solde',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // 🔧 Configurer/Mettre à jour le numéro Wave d'un établissement + Envoyer OTP
  @Post('configure-wave/:etablissementId')
  async configureWaveNumber(
    @Param('etablissementId') etablissementId: string,
    @Body() dto: ConfigureWaveDto
  ): Promise<WaveConfigResponseDto> {
    try {
      const etablissementIdNum = parseInt(etablissementId);
      
      if (isNaN(etablissementIdNum)) {
        throw new HttpException('ID établissement invalide', HttpStatus.BAD_REQUEST);
      }

      const result = await this.payoutService.updateWaveNumber(etablissementIdNum, dto.numero_wave);
      
      return {
        success: true,
        message: 'Configuration Wave mise à jour et OTP envoyé',
        data: result
      };

    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors de la configuration Wave',
        error: error.message
      };
    }
  }

  // ✅ Vérifier le code OTP et activer Wave
  @Post('verify-otp/:etablissementId')
  async verifyWaveOtp(
    @Param('etablissementId') etablissementId: string,
    @Body() dto: VerifyWaveOtpDto
  ): Promise<WaveConfigResponseDto> {
    try {
      const etablissementIdNum = parseInt(etablissementId);
      
      if (isNaN(etablissementIdNum)) {
        throw new HttpException('ID établissement invalide', HttpStatus.BAD_REQUEST);
      }

      const result = await this.payoutService.verifyWaveOtp(etablissementIdNum, dto.otp_code);
      
      return {
        success: true,
        message: 'Compte Wave vérifié et activé avec succès',
        data: result
      };

    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors de la vérification OTP',
        error: error.message
      };
    }
  }

  // 🔄 Renvoyer un nouveau code OTP
  @Post('resend-otp/:etablissementId')
  async resendWaveOtp(@Param('etablissementId') etablissementId: string){
    try {
      const etablissementIdNum = parseInt(etablissementId);
      
      if (isNaN(etablissementIdNum)) {
        throw new HttpException('ID établissement invalide', HttpStatus.BAD_REQUEST);
      }

      const result = await this.payoutService.resendWaveOtp(etablissementIdNum);
      
      return {
        success: true,
        message: 'Nouveau code OTP envoyé par email',
        data: result
      };

    } catch (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors du renvoi OTP',
        error: error.message
      };
    }
  }
}