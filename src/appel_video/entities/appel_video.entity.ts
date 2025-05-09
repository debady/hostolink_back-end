import { ExpertSante } from 'src/user_etablissement_sante/entities/expert_sante.entity';
import { User } from 'src/utilisateur/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';

  @Entity('appel_video')
  export class AppelVideo {
    @PrimaryGeneratedColumn('uuid')
    id_appel: string;
  
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'id_user' })
   utilisateur: User;
  
    @ManyToOne(() => ExpertSante, { eager: true })
    @JoinColumn({ name: 'id_expert' })
    expert: ExpertSante;
  
    @Column()
    canal_agora: string;
  
    @Column()
    token_agora: string;
  
    @Column({ default: 'en_attente' })
    status_appel: string;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date_debut: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    date_fin: Date;
  
    @Column({ type: 'double precision', nullable: true })
    latitude: number;
  
    @Column({ type: 'double precision', nullable: true })
    longitude: number;
  
    @Column({ type: 'text', nullable: true })
    compte_rendu: string;
  }
  
