import { EtablissementSante } from 'src/cree_etablissement_sante/entities/etablissement_sante.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('type_etablissement')
export class TypeEtablissement {
  @PrimaryGeneratedColumn()
  id_type_etablissement: number; // Clé primaire

  @Column({ type: 'varchar', length: 100, unique: true })
  nom_etablissement: string; // Nom du type d’établissement (ex: Hôpital, Clinique, Pharmacie)

  @OneToMany(() => EtablissementSante, (etablissement) => etablissement.type_etablissement)
  etablissements: EtablissementSante[]; // Relation avec les établissements
}
