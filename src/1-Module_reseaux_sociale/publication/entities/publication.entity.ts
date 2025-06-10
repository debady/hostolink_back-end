import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Commentaire } from 'src/1-Module_reseaux_sociale/commentaire/entities/commentaire.entity';
import { Partage } from 'src/1-Module_reseaux_sociale/partage/entities/partage.entity';

@Entity('publication')
export class Publication { 
  @PrimaryGeneratedColumn()
  id_publication: number;

  @Column({ type: 'varchar', length: 255 })
  titre_publication: string;

  @Column({ type: 'text' })
  contenu: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @CreateDateColumn()
  date_publication: Date;

  @Column({ type: 'integer', default: 0 })
  compteur_like: number;

  // Colonnes pour identifier l'auteur (une seule sera remplie automatiquement)
  @Column({ type: 'uuid', nullable: true })
  id_user: string;

  @Column({ type: 'integer', nullable: true })
  id_user_etablissement_sante: number;

  @Column({ type: 'integer', nullable: true })
  id_admin_gestionnaire: number;

  @Column({ type: 'integer', nullable: true })
  id_expert: number;

  // Relations
  @OneToMany(() => Commentaire, commentaire => commentaire.publication, { cascade: true })
  commentaires: Commentaire[];

  @OneToMany(() => Partage, partage => partage.publication, { cascade: true })
  partages: Partage[];
}