import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('utilisateur') // Correspond au nom de ta table dans PostgreSQL
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ nullable: true })
  nom: string;

  @Column({ nullable: true })
  prenom: string;

  @Column({ unique: true,nullable: true })
  email: string;

  @Column({ unique: true,nullable: true })
  telephone: string;

  @Column({ nullable: true })
  pays: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP',nullable: true })
  date_inscription: Date;

  @Column({ nullable: true })
  photo_profile: string;

  @Column({ nullable: true })
  code_confirmation: string;  // ✅ Cette colonne doit exister

  @Column({ nullable: true })
  mdp: string;  

  @Column({ type: 'timestamp',  default: () => 'CURRENT_TIMESTAMP',nullable: true })
  derniere_connexion: Date;


}
