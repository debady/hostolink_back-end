// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// @Entity('utilisateur_vocatext')
// export class Utilisateur  {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ nullable: true })
//   email?: string;

//   @Column({ nullable: true })
//   telephone?: string;

//   @Column()
//   methode_connexion: string; 

  
//   @Column()
//   pseudo: string;

//   @Column({ nullable: true })
//   image_profil?: string;

//   @Column({ default: false })
//   is_verified: boolean;

//   @Column({ nullable: true })
//   otp_code?: string;

//   @Column({ nullable: true, type: 'timestamp' })
//   otp_expires_at?: Date;

//   @Column({ default: 0 })
//   otp_attempt_count: number;

//   @Column({ nullable: true, type: 'timestamp' })
//   otp_last_sent_at?: Date;

//   @Column({ nullable: true, type: 'timestamp' })
//   otp_blocked_until?: Date;

// }
