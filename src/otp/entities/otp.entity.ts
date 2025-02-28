import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('otp')
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.otps, { onDelete: 'CASCADE', eager: false, nullable: false }) 
  user: User;

  @Column({ type: 'int' }) // ✅ Ajout explicite de la clé étrangère
  userId: number;

  @Column({ type: 'varchar', length: 6 }) // ✅ OTP de 6 chiffres
  otp_code: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({ type: 'boolean', default: true })
  is_valid: boolean;
}
