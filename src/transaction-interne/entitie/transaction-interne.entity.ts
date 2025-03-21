// src/transaction/entities/transaction.entity.ts
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { Compte } from '../compte/entities/compte.entity';

export enum TransactionType {
  TRANSFERT = 'transfert',
  PAIEMENT_QRCODE = 'paiement_qrcode'
}

export enum TransactionStatus {
  EN_ATTENTE = 'en attente',
  COMPLETEE = 'completee',
  ECHOUEE = 'echouee',
  ANNULEE = 'annulee'
}

@Entity('transaction_interne')
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  id_transaction: number;

  @Column()
  id_compte_expediteur: number;

  @Column()
  id_compte_recepteur: number;

  @Column({ nullable: true })
  id_utilisateur_recepteur: number;

  @Column({ nullable: true })
  id_etablissement_recepteur: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  montant: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  frais_transaction: number;

  @Column({ length: 20, default: TransactionStatus.EN_ATTENTE })
  statut: string;

  @Column({ length: 10 })
  devise_transaction: string;

  @Column({ length: 100, nullable: true })
  type_transaction: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_transaction: Date;

  @Column({ nullable: true })
  id_qrcode: number;

  @Column({ nullable: true })
  id_user_etablissement_sante: number;
}