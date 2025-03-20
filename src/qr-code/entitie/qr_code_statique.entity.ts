
// src/qr-code/entities/qr-code-statique.entity.ts
import { User } from 'src/utilisateur/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('qr_code_paiement_statique') // Assurez-vous que ce décorateur est présent
export class QrCodeStatique {
  @PrimaryGeneratedColumn('increment')
  id_qrcode: number;
  
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
  
  // Relation avec l'utilisateur
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_user' })
  user: User;
q
  
  /* 
   * Relation avec l'établissement de santé (à décommenter plus tard)
   */
  /*
  @ManyToOne(() => EtablissementSante, { nullable: true })
  @JoinColumn({ name: 'id_user_etablissement_sante' })
  etablissement: EtablissementSante;
  */
}