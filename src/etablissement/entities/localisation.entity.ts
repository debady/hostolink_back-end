import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EtablissementSante } from './etablissement_sante.entity';

@Entity('localisation') // Nom de la table dans PostgreSQL
export class Localisation {
  @PrimaryGeneratedColumn()
  id_localisation: number; // ✅ Clé primaire

  @Column({ type: 'numeric', precision: 10, scale: 8 })
  latitude: number; // ✅ Stocke la latitude

  @Column({ type: 'numeric', precision: 10, scale: 8 })
  longitude: number; // ✅ Stocke la longitude

  @OneToMany(() => EtablissementSante, (etablissement) => etablissement.localisation)
  etablissements: EtablissementSante[]; // ✅ Relation avec les établissements
}
