import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { Partage } from 'src/partage/entities/partage.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Publication { // Utiliser une majuscule pour le nom de classe
  @PrimaryGeneratedColumn()
  id_publication: number;

  @Column()
  titre_publication: string;

  @Column()
  contenu: string;

  @Column({ nullable: true })
  image?: string;


  @Column()
  date_publication: Date;

  @Column({ default: 0 })
  compteur_like: number;

  // Modifiez cette partie en fonction de votre structure de base de données
  @ManyToOne(() => User, { nullable: false }) // Rendre la relation obligatoire
  @JoinColumn({ name: 'id_user' })
  user: User;
    // commentaire: any;

  // Relation avec les commentaires
  @OneToMany(() => Commentaire, commentaire => commentaire.publication)
  commentaires: Commentaire[];

  // Relation avec les commentaires
  @OneToMany(() => Partage, Partage => Partage.publication)
  Partages: Partage[];
}