// src/qr-code/entities/qr-code-dynamique.entity.ts
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('qr_code_paiement_dynamique')
export class QrCodeDynamique {
  @PrimaryGeneratedColumn('increment')
  id_qr_code: number;

  @Column({ nullable: true })
  id_user_etablissement_sante: number;
  
  @Column({ nullable: true, type: 'uuid' })
  id_user: string;

  @Column({ length: 1000 })
  token: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;

  @Column({ type: 'timestamp' })
  date_expiration: Date;

  @Column({ length: 20, default: 'actif' })
  statut: string;
}