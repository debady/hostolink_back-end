import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Publication } from 'src/1-Module_reseaux_sociale/publication/entities/publication.entity';

@Entity('partage')
export class Partage {
  @PrimaryGeneratedColumn()
  id_partage: number;

  // Référence à la publication
  @ManyToOne(() => Publication, publication => publication.partages, {
    nullable: false,
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'id_publication' })
  publication: Publication;

  @Column()
  lien_partage: string;

  @CreateDateColumn()
  date_partage: Date;

  @Column({ nullable: true })
  plateforme_partage: string; // WhatsApp, Facebook, Email, etc.

  @Column({ default: 0 })
  nombre_clics: number;

  // Colonnes pour identifier l'auteur du partage (une seule sera remplie automatiquement)
  @Column({ type: 'uuid', nullable: true })
  id_user: string;

  @Column({ type: 'integer', nullable: true })
  id_user_etablissement_sante: number;

  @Column({ type: 'integer', nullable: true })
  id_admin_gestionnaire: number;

  @Column({ type: 'integer', nullable: true })
  id_expert: number;
}