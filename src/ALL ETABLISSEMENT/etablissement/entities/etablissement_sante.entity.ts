import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Localisation } from './localisation.entity';
import { EtablissementTelephone } from './etablissement_telephone.entity';  // Importation de l'entité
import { TypeEtablissement } from './type-etablissement.entity';

@Entity('etablissement_sante')
export class EtablissementSante {
  @PrimaryGeneratedColumn()
  id_etablissement: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  nom_etablissement_sante: string;

  @Column({ type: 'text', nullable: false })
  adresse_etablissement_sante: string;

  @ManyToOne(() => TypeEtablissement, (type) => type.etablissements, { eager: true })
  @JoinColumn({ name: 'id_type_etablissement' })
  type_etablissement: TypeEtablissement;

  @ManyToOne(() => Localisation, (localisation) => localisation.etablissements, { eager: true, nullable: true })
  @JoinColumn({ name: 'id_localisation' })
  localisation: Localisation;

  @OneToMany(() => EtablissementTelephone, (telephone) => telephone.etablissement)
  telephones: EtablissementTelephone[]; // Relation avec les téléphones
}
