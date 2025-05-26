import { User } from 'src/utilisateur/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'documents_identite' }) // ✅ IMPORTANT
export class DocumentsIdentiteEntity {
  @PrimaryGeneratedColumn({ name: 'id_document' })
  id_document: number;

  @Column({ name: 'id_user', type: 'uuid' })
  id_user: string;

  @Column({ name: 'type_document', length: 50 })
  type_document: string;

  @Column({ name: 'url_recto', type: 'text' })
  url_recto: string;

  @Column({ name: 'url_verso', type: 'text', nullable: true })
  url_verso?: string;

  @Column({ name: 'url_photo_profile', type: 'text' })
  url_photo_profile: string;

  @Column({ name: 'statut_validation', length: 20, default: 'en_attente' })
  statut_validation: string;

  @CreateDateColumn({ name: 'date_envoi' })
  date_envoi: Date;


  @ManyToOne(() => User, user => user.document_identite, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  user: User;


}
