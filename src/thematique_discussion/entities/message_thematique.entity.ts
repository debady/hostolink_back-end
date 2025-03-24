import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
 
import { User } from 'src/utilisateur/entities/user.entity';
import { Thematique } from './thematique.entity';

  
  
  @Entity('messages_thematique')
  export class MessageThematique {
    @PrimaryGeneratedColumn()
    id_message: number;
  
    @ManyToOne(() => Thematique, (thematique) => thematique.messages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_thematique_discussion' })
    thematique: Thematique;
  
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_expediteur' })
    expediteur: User;
  
    @Column('text')
    contenu: string;
  
    @Column({ type: 'varchar', length: 20 })
    type_message: string; // 'texte' ou 'image'
  
    @CreateDateColumn({ name: 'date_envoi' })
    date_envoi: Date;
  
    @Column({ default: false })
    est_lu: boolean;
  }
  