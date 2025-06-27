import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaveCheckoutService } from './wave-checkout.service';
import { WaveCheckoutController } from './wave-checkout.controller';
import { WaveCheckoutSession } from './entities/wave-checkout-session.entity';
import { User } from 'src/utilisateur/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WaveCheckoutSession, User])],
  controllers: [WaveCheckoutController],
  providers: [WaveCheckoutService],
})
export class WaveCheckoutModule {}
