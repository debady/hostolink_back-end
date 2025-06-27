import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('transactions_frais')
export class TransactionsFrais {
  @PrimaryGeneratedColumn()
  id_frais: number;

  @Column()
  id_transaction: number;

  @Column('decimal', { precision: 10, scale: 2 })
  montant_frais: number;

  @Column({ length: 20 })
  type_transaction: string;

  @Column({ length: 20 })
  mode_paiement: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;
}