import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { WavePayoutController } from './controllers/wave-payout.controller';
import { WavePayoutService } from './services/wave-payout.service';
import { WaveEmailService } from './services/wave-email.service';
import { WavePayoutSession } from './entities/wave-payout-session.entity';
import { UserEtablissementSante } from '../user_etablissement_sante/entities/user-etablissement-sante.entity';
import { Otp } from '../utilisateur/entities/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WavePayoutSession,
      UserEtablissementSante,
      Otp
    ]),
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 3,
    })
  ],
  controllers: [WavePayoutController],
  providers: [WavePayoutService, WaveEmailService],
  exports: [WavePayoutService, WaveEmailService]
})
export class WavePayoutModule {}