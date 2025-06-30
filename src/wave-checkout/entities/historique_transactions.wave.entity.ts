import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('historique_transactions')
export class HistoriqueTransactions {
  @PrimaryGeneratedColumn()
  id_historique: number;

  @Column()
  id_transaction: number;

  @Column({ length: 20, nullable: true })
  ancien_statut: string;

  @Column({ length: 20, nullable: true })
  nouveau_statut: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_modification: Date;

  @Column({ nullable: true })
  id_user_etablissement_sante: number;

  @Column({ type: 'uuid', nullable: true })
  id_user: string;
}