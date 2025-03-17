// ----------------------
// Entité Notification
// ----------------------
import { UserEtablissementSante } from 'src/user_etablissement_sante/entitie/user_etablissement_sante.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum NotificationType {
  CREDIT = 'credit',
  DEBIT = 'debit',
  REFUND = 'refund',
  INFO = 'info'
}

@Entity('notification_transaction')
export class NotificationTransaction {
  @PrimaryGeneratedColumn('increment')
  id_notification_transaction: number;

  @Column()
  id_transaction: number;

  @Column({ default: () => "('Hstlk-'::text || substr(md5(random()::text), 1, 5))" })
  identif_transaction: string;

  @Column({
    type: 'enum',
    enum: NotificationType
  })
  type_notification: NotificationType;

  @Column('text')
  contenu: string;

  @Column('numeric', { precision: 15, scale: 2, nullable: true })
  montant: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_envoi: Date;

  @Column({ default: 'envoyé' })
  statut: string;

  @Column({ default: false })
  is_lu: boolean;

  @Column({ nullable: true })
  id_user_etablissement_sante: number;

  @Column({ nullable: true, type: 'uuid' })
  id_user: string;

  @ManyToOne(() => UserEtablissementSante, { nullable: true })
  @JoinColumn({ name: 'id_user_etablissement_sante' })
  etablissement: UserEtablissementSante;
}