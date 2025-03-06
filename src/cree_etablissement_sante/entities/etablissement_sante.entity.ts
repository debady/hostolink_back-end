import { TypeEtablissement } from 'src/categories_etabalissement_sante/entities/type-etablissement.entity';
import { Localisation } from 'src/localisation_etablissement_sante/entities/localisation.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { EtablissementTelephone } from './etablissement_telephone.entity';


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
