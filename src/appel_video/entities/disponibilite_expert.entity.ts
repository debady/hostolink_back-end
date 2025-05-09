import { ExpertSante } from 'src/user_etablissement_sante/entities/expert_sante.entity';
import {
    Entity,
    PrimaryColumn,
    Column,
    OneToOne,
    JoinColumn,
  } from 'typeorm';

  
  @Entity('disponibilite_expert')
  export class DisponibiliteExpert {
    @PrimaryColumn()
    id_expert: number;
  
    @OneToOne(() => ExpertSante, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_expert' })
    expert: ExpertSante;
  
    @Column({ default: false })
    est_connecte: boolean;
  
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    derniere_connexion: Date;
  
    @Column({ type: 'varchar', length: 100, nullable: true })
    zone_couverte: string;
  }
  
