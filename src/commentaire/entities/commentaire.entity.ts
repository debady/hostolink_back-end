import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Publication } from 'src/publication/entities/publication.entity';
import { User } from 'src/utilisateur/entities/user.entity';
import { UserEtablissementSante } from 'src/user_etablissement_sante/entities/user-etablissement-sante.entity';
import { Administrateur } from 'src/administrateur/entities/administrateur.entity';
import { ExpertSante } from 'src/user_etablissement_sante/entities/expert_sante.entity';

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


  // Relations auteurs
  @ManyToOne(() => User, utilisateur => utilisateur.commentaire, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_user' })
  utilisateur: User;

  @ManyToOne(() => UserEtablissementSante, etab => etab.commentaire, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_user_etablissement_sante' })
  etablissement: UserEtablissementSante;

  @ManyToOne(() => Administrateur, admin => admin.commentaire, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_admin_gestionnaire' })
  admin: Administrateur;

  @ManyToOne(() => ExpertSante, expert => expert.commentaire, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_expert' })
  expert: ExpertSante;
}