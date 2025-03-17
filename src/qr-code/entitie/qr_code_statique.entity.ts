// ----------------------
// Entités QR Code
// ----------------------
import { UserEtablissementSante } from 'src/user_etablissement_sante/entitie/user_etablissement_sante.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('qr_code_paiement_statique')
export class QrCodeStatique {
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

  @Column({ type: 'timestamp', nullable: true })
  date_expiration: Date;

  @Column({ length: 20, default: 'actif' })
  statut: string;

  @ManyToOne(() => UserEtablissementSante, { nullable: true })
  @JoinColumn({ name: 'id_user_etablissement_sante' })
  etablissement: UserEtablissementSante;
}