import { Otp } from 'src/code_verif_otp/entities/otp.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';

@Entity('utilisateur')  
export class User {
  [x: string]: any;

  @PrimaryGeneratedColumn('uuid')
  id_user: string;

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

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo_profile?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_inscription: Date;

  // @Column({ type: 'varchar', length: 10, nullable: true, default: null })
  // code_confirmation: string | null;

  @Column({ type: 'text', nullable: true })
  raison_banni?: string;

  @Column({ type: 'boolean', default: false })
  compte_verifier: boolean;


  @OneToMany(() => Otp, otp => otp.user, { cascade: true, nullable: true })
  otps?: Otp[];

  @Column('geometry', { spatialFeatureType: 'Point', srid: 4326, nullable: true })
  position?: string;
}
