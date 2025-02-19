import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('utilisateur')
export class Utilisateur {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ nullable: true })
  nom: string;

  @Column({ nullable: true })
  prenom: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  telephone: string;

  @Column({ nullable: true })
  pays: string;

  @Column({ nullable: true })
  photo_profile: string;

  @Column({ nullable: true })
  mdp: string;
}
