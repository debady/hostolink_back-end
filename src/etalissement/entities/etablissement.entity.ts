 
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('etablissement')
export class Etablissement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ nullable: true })
  adresse: string;

  @Column()
  type: string;  // hopital, clinique, pharmacie

  @Column({ nullable: true })
  telephone: string;

  @Column('geography', { spatialFeatureType: 'Point', srid: 4326 })
  localisation: string; // Stocke la latitude et la longitude
}
