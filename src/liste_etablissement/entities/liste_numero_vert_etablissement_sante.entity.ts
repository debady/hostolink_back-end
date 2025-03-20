import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity('liste_numero_vert_etablissement_sante')
export class ListeNumeroEtablissementSante {
  @PrimaryGeneratedColumn()
  id_liste_num_etablissement_sante: number;

  @Column({ type: 'integer', nullable: true }) // ✅ Simple ID stocké, pas de relation
  id_admin_gestionnaire: number | null;
  
  // @ManyToOne({ type: 'integer', nullable: true }) // Peut être NULL
  // id_admin_gestionnaire: number | null;

  @Column({ type: 'varchar', length: 20, nullable: false })
  contact: string;

  @Column({ type: 'varchar', length: 255, nullable:  false })
  image: string;

  @Column({ type: 'varchar', length: 255, nullable: false  })
  nom_etablissement: string;

  @Column({ type: 'text', nullable: false})
  presentation: string;

  @Column({ type: 'varchar', length: 255, nullable: false})
  adresse: string;

  @Column({ type: 'double precision', nullable: false })
  latitude: number;

  @Column({ type: 'double precision', nullable: false })
  longitude: number;

  @Column({ type: 'varchar', length: 255, nullable:false })
  site_web: string;

  @Column({ type: 'varchar', length: 50, nullable: false }) // ✅ Obligatoire
  type_etablissement: string;

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'Autre' })
  categorie: string;
}














































































































































// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { Administrateur } from 'src/administrateurs/entities/administrateur.entity';

// export enum TypeEtablissement {
//   HOPITAL_GENERAL = 'HOPITAL_GENERAL',
//   CLINIQUE = 'CLINIQUE',
//   PHARMACIE = 'PHARMACIE'
// }

// @Entity('liste_numero_vert_etablissement_sante')

// export class ListeNumeroVertEtablissementSante  {
//   @PrimaryGeneratedColumn('increment', { name: 'id_liste_num_etablissement_sante' })
//   id: number;

//   @Column({ name: 'id_admin_gestionnaire', type: 'int' })
//   idAdminGestionnaire: number;

//   @ManyToOne(() => Administrateur, (admin) => admin.liste_num_etablissement_sante)
//   @JoinColumn({ name: 'id_admin_gestionnaire' })
//   admin: Administrateur;

//   @Column({ name: 'nom_etablissement', type: 'varchar', length: 255 })
//   nomEtablissement: string;

//   @Column({ name: 'contact', type: 'varchar', length: 20 })
//   contact: string;

//   @Column({ name: 'image', type: 'varchar', length: 255, nullable: true })
//   image: string;

//   @Column({ name: 'presentation', type: 'text' })
//   presentation: string;

//   @Column({ name: 'adresse', type: 'varchar', length: 255 })
//   adresse: string;

//   @Column({ name: 'latitude', type: 'float' })
//   latitude: number;

//   @Column({ name: 'longitude', type: 'float' })
//   longitude: number;

//   @Column({ name: 'type_etablissement' })
//   type_etablissement: string;

//   @Column({ name: 'site_web', type: 'varchar', length: 255, nullable: true })
//   siteWeb: string;
// }