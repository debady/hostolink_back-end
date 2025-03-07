import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('etablissement_sante')
export class Etablissement {
  @PrimaryGeneratedColumn()
  id_etablissement: number;

  @Column()
  nom: string;

  @Column()
  telephone: string;

  @Column()
  categorie_etablissement: string;

  @Column('geometry', { spatialFeatureType: 'Point', srid: 4326 })
  position: string;

  @Column({ nullable: true })
  adresse: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
