import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('transaction_externe')
export class TransactionExterne {
  @PrimaryGeneratedColumn()
  id_transaction_externe: number;

  @Column('uuid')
  id_utilisateur: string;

  @Column('decimal', { precision: 15, scale: 2 })
  montant: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  frais_transaction: number;

  @Column({ length: 20, default: 'en attente' })
  statut: string;

  @Column({ length: 10 })
  devise: string;

  @Column({ length: 100, nullable: true })
  type_transaction: string;

  @Column({ length: 50, nullable: true })
  moyen_paiement: string;

  @Column({ length: 100, nullable: true, unique: true })
  reference_externe: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_transaction: Date;

  @Column({ length: 255 })
  motif: string;

  @Column()
  id_compte: number;

  @Column({ nullable: true })
  id_moyen_paiement: number;

  @Column({ nullable: true })
  id_transaction: number;
}