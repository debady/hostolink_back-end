import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../utilisateur/entities/user.entity';

export enum MoyenEnvoiEnum {
  // TELEPHONE = 'telephone',
  SMS = 'SMS',
  EMAIL = 'email',
}

@Entity('code_verif_otp')
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.otps, { onDelete: 'CASCADE', nullable: true, eager: true })
  @JoinColumn({ name: 'id_user' })  
  user: User;

  // @Column({ type: 'uuid', nullable: true })
  // id_user: string;

  @Column({ type: 'varchar', length: 6, nullable: false })
  otp_code: string;

  @Column({ type: 'enum', enum: MoyenEnvoiEnum, nullable: false })
  moyen_envoyer: MoyenEnvoiEnum; 

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({ type: 'boolean', default: true })
  is_valid: boolean;
  
}
