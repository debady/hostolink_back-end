// src/transaction/entities/transaction-frais.entity.ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TypeTransactionFrais {
  INTERNE = 'interne',
  EXTERNE = 'externe',
  BANCAIRE = 'bancaire',
}

export enum ModePaiement {
  WALLET = 'wallet',
  MOBILE_MONEY = 'mobile_money',
  BANQUE = 'banque',
}

@Entity('transactions_frais')
export class TransactionFrais {
  @PrimaryGeneratedColumn('increment')
  id_frais: number;

  @Column()
  id_transaction: number;

  @Column()
  montant_frais: number;

  @Column({ length: 20, enum: TypeTransactionFrais })
  type_transaction: TypeTransactionFrais;

  @Column({ length: 20, enum: ModePaiement })
  mode_paiement: ModePaiement;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;
}