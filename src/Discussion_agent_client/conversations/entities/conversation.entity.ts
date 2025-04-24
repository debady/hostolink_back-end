// // src/entities/conversation.entity.ts
// import { AgentAssistance } from 'src/agent-assistant/entities/agent-assistance.entity';
// import { MessageAssistantClient } from 'src/Discussion_agent_client/message_assistant_client/entities/message-assistant-client.entity';
// import { UserEtablissementSante } from 'src/user_etablissement_sante/entities/user-etablissement-sante.entity';
// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
// import { User } from 'src/utilisateur/entities/user.entity';// import { AgentAssistance } from './agent-assistance.entity';


// @Entity('conversations')
// export class Conversation {
//   @PrimaryGeneratedColumn({ name: 'conversation_id' })
//   id: number;

//   @Column({ name: 'user_id', type: 'uuid', nullable: true })
//   userId: string;

//   @Column({ name: 'id_etablissement_sante', nullable: true })
//   etablissementSanteId: number;

//   @Column({ name: 'assistant_id' })
//   assistantId: number;

//   @Column({ name: 'start_time', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
//   startTime: Date;

//   @Column({ name: 'status', length: 50, default: 'active', nullable: true })
//   status: string;

//   @ManyToOne(() => User, user => user.conversations)
//   @JoinColumn({ name: 'user_id' })
//   user: User;

//   @ManyToOne(() => AgentAssistance, assistant => assistant.conversations)
//   @JoinColumn({ name: 'assistant_id' })
//   assistant: AgentAssistance;

//   @ManyToOne(() => UserEtablissementSante, etablissement => etablissement.conversations)
//   @JoinColumn({ name: 'id_etablissement_sante' })
//   etablissementSante: UserEtablissementSante;

//   @OneToMany(() => MessageAssistantClient, message => message.conversation)
//   messages: MessageAssistantClient[];
// }

// src/entities/conversation.entity.ts
import { AgentAssistance } from 'src/agent-assistant/entities/agent-assistance.entity';
import { MessageAssistantClient } from 'src/Discussion_agent_client/message_assistant_client/entities/message-assistant-client.entity';
import { User } from 'src/utilisateur/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';


@Entity('conversation')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'int' })
  assistantId: number;

  @Column({ default: false })
  archivee: boolean;

  @CreateDateColumn({ name: 'date_creation' })
  dateCreation: Date;

  @ManyToOne(() => AgentAssistance, (agent) => agent.conversations, { eager: true })
  agent: AgentAssistance;

  @ManyToOne(() => User, (user) => user.conversations, { eager: true })
  utilisateur: User;

  @OneToMany(() => MessageAssistantClient, (message) => message.conversation)
  messages: MessageAssistantClient[];
}
