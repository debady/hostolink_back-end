// import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { UserEtablissementSante } from './user-etablissement-sante.entity';

// @Entity()
// export class ExpertSante {
//   @PrimaryGeneratedColumn()
//   id_expert: number;

//   @ManyToOne(() => UserEtablissementSante, (etab) => etab.experts)
//   @JoinColumn({ name: 'id_user_etablissement_sante' })
//   user_etablissement_sante: UserEtablissementSante;

//   @Column()
//   nom: string;

//   @Column()
//   prenom: string;

//   @Column()
//   domaine_expertise: string;

//   @Column({ unique: true })
//   identifiant: string;

//   @Column()
//   mot_de_passe: string;

//   @Column({ nullable: true })
//   url_profile: string;
// }


import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserEtablissementSante } from './user-etablissement-sante.entity';
import { Publication } from 'src/publication/entities/publication.entity';
import { Commentaire } from 'src/commentaire/entities/commentaire.entity';


@Entity()
export class ExpertSante {
  @PrimaryGeneratedColumn()
  id_expert: number;

  @ManyToOne(() => UserEtablissementSante, (etab) => etab.experts)
  @JoinColumn({ name: 'id_user_etablissement_sante' })
  user_etablissement_sante: UserEtablissementSante;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  domaine_expertise: string;

  @Column({ unique: true })
  identifiant: string;

  @Column()
  mot_de_passe: string;

  @Column({ nullable: true })
  url_profile: string;


  @OneToMany(() => Publication, publication => publication.expert)
  publication: Publication[];

  @OneToMany(() => Commentaire, commentaire => commentaire.expert)
    commentaire: Publication[];

}