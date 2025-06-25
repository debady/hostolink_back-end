

// transaction.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entitie/transaction-interne.entity';
import { TransactionInterneController } from './transaction-interne.controller';
import { TransactionInterneService } from './transaction-interne.service';

// Importez les modules réels
import { CompteModule } from '../compte/compte.module';
import { QrCodeModule } from '../qr-code/qr-code.module';
import { UserModule } from '../utilisateur/user.module';
import { TransactionFrais } from 'src/transaction-frais/entite/transaction-frais.entity';
import { NotificationModule } from 'src/module_notification_push/notif_push.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionFrais]),
    forwardRef(() => CompteModule),
    forwardRef(() => QrCodeModule),
    forwardRef(() => UserModule),
    NotificationModule
  ],
  controllers: [TransactionInterneController],
  providers: [TransactionInterneService], 
  exports: [TransactionInterneService]
})
export class TransactionInterneModule {}