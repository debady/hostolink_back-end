// import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
// import { Otp } from 'src/otp/entities/otp.entity';
// import { Publication } from 'src/publication/entities/publication.entity';
// import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

// @Entity('utilisateur')
// export class User {
//   [x: string]: any;
//   @PrimaryGeneratedColumn()
//   id_user: number; 

//   @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
//   email?: string;

//   @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
//   telephone?: string;

//   @Column({ type: 'varchar', length: 255, nullable: true })
//   mdp?: string;

//   @Column({ type: 'varchar', length: 255, nullable: true })
//   nom?: string;

//   @Column({ type: 'varchar', length: 255, nullable: true })
//   prenom?: string;

//   @Column({ type: 'varchar', length: 100, nullable: true })
//   pays?: string;

//   @Column({ type: 'varchar', length: 255, nullable: true})
//   photo_profile?: string;

//   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   date_inscription: Date; 

//   @Column({ type: 'varchar', length: 10, nullable: true, default: null })
//   code_confirmation: string | null;

//   @OneToMany(() => Otp, otp => otp.user, { cascade: true, nullable: true }) // ✅ Ajout de nullable: true
//   otps?: Otp[];
  
//   @OneToMany(() => Publication, (publication) => publication.user)
//   publications: Publication[];

//   // Relation avec les commentaires
//   @OneToMany(() => Commentaire, commentaire => commentaire.user)
//   commentaires: Commentaire[];
// }


import { Partage } from 'src/partage/entities/partage.entity';
import { Commentaire } from 'src/commentaire/entities/commentaire.entity';
import { Otp } from 'src/otp/entities/otp.entity';
import { Publication } from 'src/publication/entities/publication.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';

@Entity('utilisateur')
export class User {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id_user: number; 

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email?: string;

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  telephone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mdp?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nom?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  prenom?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  pays?: string;

  @Column({ type: 'varchar', length: 255, nullable: true})
  photo_profile?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_inscription: Date; 

  @Column({ type: 'varchar', length: 10, nullable: true, default: null })
  code_confirmation: string | null;

  @OneToMany(() => Otp, otp => otp.user, { cascade: true, nullable: true })
  otps?: Otp[];
  
  @OneToMany(() => Publication, (publication) => publication.user)
  publications: Publication[];

  @OneToMany(() => Commentaire, commentaire => commentaire.user)
  commentaires: Commentaire[];

  // ✅ Relation One-to-One avec Partage
  @OneToMany(() => Partage, (partage) => partage.user, { cascade: true, nullable: true })
  @JoinColumn() // Ajoute une clé étrangère `partageId` dans la table utilisateur
  partage?: Partage;
}
