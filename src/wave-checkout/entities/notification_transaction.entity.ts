import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('notification_transaction')
export class NotificationTransaction {
  @PrimaryGeneratedColumn()
  id_notification_transaction: number;

  @Column()
  id_transaction: number;

  @Column({
    length: 10,
    default: () => "('Hstlk-' || substr(md5(random()::text), 1, 5))"
  })
  identif_transaction: string;

  @Column({ length: 50 })
  type_notification: string;

  @Column('text')
  contenu: string;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  montant: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_envoi: Date;

  @Column({ length: 20, default: 'envoyé' })
  statut: string;

  @Column({ default: false })
  is_lu: boolean;

  @Column({ nullable: true })
  id_user_etablissement_sante: number;

  @Column({ type: 'uuid', nullable: true })
  id_user: string;
}