import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WaveCheckoutService } from './wave-checkout.service';
import { WaveCheckoutController } from './wave-checkout.controller';
import { WaveCheckoutSession } from './entities/wave-checkout-session.entity';
import { User } from 'src/utilisateur/entities/user.entity';
import { Compte } from 'src/compte/entitie/compte.entity';
import { TransactionsFrais } from './entities/frais_depot_wave.entity';
import { TransactionExterne } from './entities/transaction_externe.entity';
import { HistoriqueTransactions } from './entities/historique_transactions.wave.entity.';
import { NotificationTransaction } from './entities/notification_transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WaveCheckoutSession, User,Compte,TransactionsFrais,TransactionExterne,HistoriqueTransactions,NotificationTransaction])],

  controllers: [WaveCheckoutController],
  providers: [WaveCheckoutService],
})
export class WaveCheckoutModule {}
