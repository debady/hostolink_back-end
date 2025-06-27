import { User } from 'src/utilisateur/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';

@Entity('wave_checkout_session')
export class WaveCheckoutSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_user', type: 'uuid' })
  idUser: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column({ name: 'session_id', length: 255, unique: true })
  sessionId: string;

  @Column({ name: 'client_reference', length: 255, nullable: true })
  clientReference?: string;

  @Column({ type: 'bigint' })
  amount: number;

  @Column({ length: 10, default: 'XOF' })
  currency: string;

  @Column({ length: 20, default: 'pending' })
  status: string;

  @Column({ name: 'success_url', type: 'text', nullable: true })
  successUrl?: string;

  @Column({ name: 'error_url', type: 'text', nullable: true })
  errorUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'webhook_received', type: 'boolean', default: false })
  webhookReceived: boolean;

  @Column({ name: 'wave_launch_url', type: 'text', nullable: true })
  waveLaunchUrl?: string;
}
