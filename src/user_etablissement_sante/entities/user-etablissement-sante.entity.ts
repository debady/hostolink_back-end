import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { CodeVerifOtp } from './code-verif-otp.entity';
import { RaisonSuppressionCompte } from './raison-suppression.entity';
import { ExpertSante } from './expert_sante.entity';
import { Conversation } from 'src/Discussion_agent_client/conversations/entities/conversation.entity';

@Entity('user_etablissement_sante')
export class UserEtablissementSante {
  @PrimaryGeneratedColumn()
  id_user_etablissement_sante: number;

  @Column({ length: 255 })
  nom: string;

  @Column({ length: 20 })
  telephone: string;

  @Column({ length: 100 })
  categorie: string;

  @Column({ type: 'text' })
  adresse: string;

  @CreateDateColumn({ name: 'creat_at' })
  creatAt: Date;

  @Column({ type: 'double precision', nullable: true })
  latitude: number;

  @Column({ type: 'double precision', nullable: true })
  longitude: number;

  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  geom: any;

  @Column({ type: 'varchar', nullable: true })
  specialites: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'text' })
  mot_de_passe: string;

  @Column({ default: true })
  compte_verifie: boolean;

  // 🆕 Nouveaux champs pour Wave
  @Column({ length: 20, nullable: true })
  numero_wave: string;

  @Column({ default: false })
  wave_verified: boolean;

  @OneToMany(() => CodeVerifOtp, (otp) => otp.userEtablissementSante)
  otps: CodeVerifOtp[];

  @OneToMany(() => RaisonSuppressionCompte, (r) => r.userEtablissementSante)
  raisons: RaisonSuppressionCompte[];

  @OneToMany(() => ExpertSante, (expert) => expert.user_etablissement_sante)
  experts: ExpertSante[];

  @OneToMany(() => Conversation, conversation => conversation.etablissementSante)
  conversations: Conversation[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  fcm_token?: string;

}
