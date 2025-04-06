import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, JoinColumn } from 'typeorm';

@Entity('user_etablissement_sante')
export class UserEtablissementSante {
  @PrimaryGeneratedColumn()
  id_user_etablissement_sante: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nom: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  telephone: string;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  mot_de_passe: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  categorie: string;

  @Column({ type: 'text', nullable: true })
  adresse: string;

  @CreateDateColumn({ type: 'timestamp' })
  creat_at: Date;

  @Column({ type: 'double precision', nullable: true })
  latitude: number;

  @Column({ type: 'double precision', nullable: true })
  longitude: number;

  @Column({ type: 'geometry', nullable: true })
  geom: string;

  @Column({ type: 'varchar', nullable: true })
  specialites: string;

  // @OneToMany(() => ImageEntity, (image) => image.userEtablissementSante, { cascade: true })
  // @JoinColumn({ name: 'id_user_etablissement_sante' }) 
  // images: ImageEntity[];
}
