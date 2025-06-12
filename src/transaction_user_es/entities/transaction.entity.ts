
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('transaction_user_es')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  id_user: string;

  @Column({ type: 'int' })
  id_etablissement: number;

  @Column({ type: 'text' })
  qr_code_valeur: string;

  @Column({ type: 'varchar', length: 50, default: 'en_attente' })
  statut: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  montant: number;

  @CreateDateColumn()
  date_creation: Date;

  @UpdateDateColumn()
  date_mise_a_jour: Date;
}
