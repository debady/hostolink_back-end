
// ----------------------
// Entité Transaction
// ----------------------
import { Compte } from 'src/compte/entitie/compte.entity';
import { TransactionFrais } from 'src/transaction_frais/entitie/transaction_frais.entity';
import { UserEtablissementSante } from 'src/user_etablissement_sante/entitie/user_etablissement_sante.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transaction_interne')
export class TransactionInterne {
  @PrimaryGeneratedColumn('increment')
  id_transaction: number;

  @Column()
  id_compte_expediteur: number;

  @Column({ nullable: true })
  id_utilisateur_recepteur: number;

  @Column({ nullable: true })
  id_etablissement_recepteur: number;

  @Column('numeric', { precision: 15, scale: 2 })
  montant: number;

  @Column('numeric', { precision: 10, scale: 2, default: 0 })
  frais_transaction: number;

  @Column({ length: 20, default: 'en attente' })
  statut: string;

  @Column({ length: 10 })
  devise_transaction: string;

  @Column({ length: 100, nullable: true })
  type_transaction: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_transaction: Date;

  @Column({ nullable: true })
  id_qrcode: number;

  @Column()
  id_compte_recepteur: number;

  @Column({ nullable: true })
  id_user_etablissement_sante: number;

  @ManyToOne(() => Compte)
  @JoinColumn({ name: 'id_compte_expediteur' })
  compteExpediteur: Compte;

  @ManyToOne(() => Compte)
  @JoinColumn({ name: 'id_compte_recepteur' })
  compteRecepteur: Compte;

  @ManyToOne(() => TransactionFrais)
  @JoinColumn({ name: 'id_transaction', referencedColumnName: 'id_transaction' })
  frais: TransactionFrais;

  @ManyToOne(() => UserEtablissementSante, { nullable: true })
  @JoinColumn({ name: 'id_user_etablissement_sante' })
  etablissement: UserEtablissementSante;
}