import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EtablissementSante } from './etablissement_sante.entity';

@Entity('etablissement_telephone')
export class EtablissementTelephone {
  @PrimaryGeneratedColumn()
  id_telephone: number; // Clé primaire

  @Column({ type: 'varchar', length: 20, nullable: false })
  numero: string; // Numéro de téléphone

  @ManyToOne(() => EtablissementSante, (etablissement) => etablissement.telephones, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_etablissement' })
  etablissement: EtablissementSante; // Relation avec l'établissement de santé
}
