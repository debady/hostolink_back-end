// ----------------------
// Entité Transaction Frais
// ----------------------
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions_frais')
export class TransactionFrais {
  @PrimaryGeneratedColumn('increment')
  id_frais: number;

  @Column()
  id_transaction: number;

  @Column()
  montant_frais: number;

  @Column({ length: 20 })
  mode_paiement: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;
}