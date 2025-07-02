import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEtablissementSante } from '../../user_etablissement_sante/entities/user-etablissement-sante.entity';

@Entity('wave_payout_session')
export class WavePayoutSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_user_etablissement_sante: number;

  // 🔑 Données envoyées à Wave
  @Column({ unique: true })
  idempotency_key: string;

  @Column({ default: 'XOF' })
  currency: string;

  @Column()
  receive_amount: string;

  @Column()
  name: string;

  @Column()
  mobile: string;

  // 📨 Réponse de Wave
  @Column({ nullable: true })
  wave_payout_id: string;

  @Column({ nullable: true })
  wave_fee: string;

  @Column({ nullable: true })
  wave_status: string;

  @Column({ type: 'timestamp', nullable: true })
  wave_timestamp: Date;

  // 🕒 Gestion interne
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 🔗 Relations
  @ManyToOne(() => UserEtablissementSante)
  @JoinColumn({ name: 'id_user_etablissement_sante' })
  etablissement: UserEtablissementSante;
}