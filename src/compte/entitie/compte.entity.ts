
// Entité Compte
import { UserEtablissementSante } from 'src/user_etablissement_sante/entitie/user_etablissement_sante.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('compte')
export class Compte {
  @PrimaryGeneratedColumn('increment')
  id_compte: number;

  @Column({ default: 0 })
  solde_compte: number;

  @Column({ default: 0 })
  solde_bonus: number;

  @Column({ default: 0 })
  cumule_mensuel: number;

  @Column({ default: 100000 })
  plafond: number;

  @Column({ length: 50, nullable: true })
  mode_paiement_preferentiel: string;

  @Column({ length: 20, nullable: false })
  type_user: string;

  @Column({ length: 10, nullable: false })
  devise: string;

  @Column({ length: 50, nullable: true, unique: true })
  numero_compte: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_creation_compte: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_modification: Date;

  @Column({ length: 20, default: 'actif' })
  statut: string;

  @Column({ nullable: true })
  id_user_etablissement_sante: number;

  @Column({ type: 'uuid', nullable: true })
  id_user: string;

  @ManyToOne(() => UserEtablissementSante, { nullable: true })
  @JoinColumn({ name: 'id_user_etablissement_sante' })
  etablissement: UserEtablissementSante;
}