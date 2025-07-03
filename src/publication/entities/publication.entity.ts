import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { Partage } from 'src/partage/entities/partage.entity';
import { UserEtablissementSante } from 'src/user_etablissement_sante/entities/user-etablissement-sante.entity';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
import { ExpertSante } from 'src/user_etablissement_sante/entities/expert_sante.entity';
import { User } from 'src/utilisateur/entities/user.entity';

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

  // Relations auteurs
  @ManyToOne(() => User, utilisateur => utilisateur.publication, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_user' })
  utilisateur: User;

  @ManyToOne(() => UserEtablissementSante, etab => etab.publication, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_user_etablissement_sante' })
  etablissement: UserEtablissementSante;

  @ManyToOne(() => Administrateur, admin => admin.publication, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_admin_gestionnaire' })
  admin: Administrateur;

  @ManyToOne(() => ExpertSante, expert => expert.publication, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_expert' })
  expert: ExpertSante;

  // Relations
  @OneToMany(() => Commentaire, commentaire => commentaire.publication, { cascade: true })
  commentaires: Commentaire[];

  @OneToMany(() => Partage, partage => partage.publication, { cascade: true })
  partages: Partage[];
}