import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Utilisateur {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ nullable: false }) // ✅ Assure-toi que `nullable: false` est bien précisé
  nom: string;

  @Column({ nullable: true }) // Permet d'avoir des valeurs NULL si nécessaire
  prenom?: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  telephone: string;

  @Column({ nullable: true }) // Permet d'accepter NULL
  pays?: string;

  @Column({ nullable: true })
  photo_profile?: string;

  @Column()
  mdp: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date_inscription: Date;

  @Column({ nullable: true })
  code_confirmation?: string;

  @Column('geometry', { spatialFeatureType: 'Point', srid: 4326, nullable: true })
  position?: string;
}
