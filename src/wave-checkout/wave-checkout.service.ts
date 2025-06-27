import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaveCheckoutSession } from './entities/wave-checkout-session.entity';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { CreateWaveSessionDto } from './dto/create-wave-session.dto';

@Injectable()
export class WaveCheckoutService {
  private readonly waveApiUrl = 'https://api.wave.com/v1/checkout/sessions';
  private readonly waveApiToken: string;
  private readonly logger = new Logger(WaveCheckoutService.name);

  constructor(
    @InjectRepository(WaveCheckoutSession)
    private readonly waveSessionRepo: Repository<WaveCheckoutSession>,
    private readonly configService: ConfigService,
  ) {
this.waveApiToken = this.configService.get<string>('WAVE_API_TOKEN') ?? '';
if (!this.waveApiToken) {
  throw new Error('WAVE_API_TOKEN is not defined in environment variables.');
}
  }

  async createSession(dto: CreateWaveSessionDto): Promise<WaveCheckoutSession> {
    try {
      const response = await axios.post(
        this.waveApiUrl,
        {
          amount: dto.amount,
          currency: dto.currency || 'XOF',
          client_reference: dto.clientReference,
          success_url: dto.successUrl,
          error_url: dto.errorUrl,
        },
        // {
        //   headers: {
        //     Authorization: `Token ${this.waveApiToken}`,
        //     'Content-Type': 'application/json',
        //   },
        // },

        {
          headers: {
            Authorization: `Bearer ${this.waveApiToken}`, // ✅ Correction ici
            'Content-Type': 'application/json',
          },
        },
      );

      const data = response.data;

      const session = this.waveSessionRepo.create({
        idUser: dto.idUser,
        sessionId: data.id,
        clientReference: dto.clientReference,
        amount: dto.amount,
        currency: dto.currency || 'XOF',
        successUrl: dto.successUrl,
        errorUrl: dto.errorUrl,
        status: 'pending',
      });

      return await this.waveSessionRepo.save(session);
    } catch (error) {
      this.logger.error(
        'Erreur lors de la création de session Wave',
        error?.response?.data || error.message,
      );
      throw new HttpException(
        error?.response?.data || 'Wave session creation failed',
        error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSessionStatus(sessionId: string, status: string): Promise<void> {
    const result = await this.waveSessionRepo.update(
      { sessionId },
      {
        status,
        updatedAt: new Date(),
        webhookReceived: true,
      },
    );

    if (result.affected === 0) {
      throw new HttpException(
        'Session Wave introuvable',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findBySessionId(sessionId: string): Promise<WaveCheckoutSession | null> {
    return await this.waveSessionRepo.findOne({
      where: { sessionId },
      relations: ['user'], // utile si on veut les infos utilisateur
    });
  }
}
