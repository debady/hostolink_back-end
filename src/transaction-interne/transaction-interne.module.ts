import { forwardRef, Module } from '@nestjs/common';
import { TransactionInterneService } from './transaction-interne.service';
// import { TransactionInterneController } from './transaction-interne.controller';
import { Transaction } from './entitie/transaction-interne.entity';
import { TransactionFrais } from 'src/transaction-frais/entite/transaction-frais.entity';
import { CompteModule } from 'src/compte/compte.module';
import { QrCodeModule } from 'src/qr-code/qr-code.module';
import { UserModule } from 'src/utilisateur/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

// transaction-interne.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionFrais]), // Assurez-vous que ces entités sont importées
    forwardRef(() => CompteModule),
    forwardRef(() => QrCodeModule),
    forwardRef(() => UserModule)
  ],
  // controllers: [TransactionInterneController],
  providers: [TransactionInterneService],
  exports: [TransactionInterneService]
})
export class TransactionInterneModule {}