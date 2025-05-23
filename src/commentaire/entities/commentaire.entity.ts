import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Publication } from 'src/publication/entities/publication.entity';

@Entity('commentaire')
export class Commentaire {
  @PrimaryGeneratedColumn()
  id_commentaire: number;

  @Column({ type: 'text' })
  contenu: string;

  @CreateDateColumn()
  date_commentaire: Date;

  // Référence à la publication
  @ManyToOne(() => Publication, publication => publication.commentaires, {
    nullable: false,
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'id_publication' })
  publication: Publication;

  // Colonnes pour identifier l'auteur du commentaire (une seule sera remplie automatiquement)
  @Column({ type: 'uuid', nullable: true })
  id_user: string;

  @Column({ type: 'integer', nullable: true })
  id_user_etablissement_sante: number;

  @Column({ type: 'integer', nullable: true })
  id_admin_gestionnaire: number;

  @Column({ type: 'integer', nullable: true })
  id_expert: number;
}