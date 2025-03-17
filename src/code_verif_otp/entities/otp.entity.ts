import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../utilisateur/entities/user.entity';

export enum MoyenEnvoiEnum {
  TELEPHONE = 'telephone',
  EMAIL = 'email',
}

@Entity('code_verif_otp')
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.otps, { onDelete: 'CASCADE', nullable: false, eager: true })
  @JoinColumn({ name: 'id_user' })  // ✅ Assure la correspondance avec la base de données
  user: User;

  @Column({ type: 'varchar', length: 6 })
  otp_code: string;

  @Column({ type: 'enum', enum: MoyenEnvoiEnum, nullable: false })
  moyen_envoyer: MoyenEnvoiEnum; // ✅ Pas besoin de `.toLowerCase()`, correction dans `generateOtp()`

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({ type: 'boolean', default: true })
  is_valid: boolean;
}
