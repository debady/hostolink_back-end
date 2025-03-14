import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('code_verif_otp')
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.otps, { onDelete: 'CASCADE', eager: false, nullable: false })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  @Column({ name: 'user_id', type: 'int' }) 
  userId: number;

  @Column({ type: 'varchar', length: 6 })
  otp_code: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @Column({ type: 'boolean', default: true })
  is_valid: boolean;
}


// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { User } from '../../user/entities/user.entity';

// @Entity('otp')
// export class Otp {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => User, user => user.otps, { onDelete: 'CASCADE', eager: false, nullable: false })
//   @JoinColumn({ name: 'user_id' }) // Associe `user_id` à la relation
//   user: User;

//   @Column({ name: 'user_id', type: 'int' }) // Déclaration correcte du champ userId
//   userId: number;

//   @Column({ type: 'varchar', length: 6 })
//   otp_code: string;

//   @Column({ type: 'timestamp' })
//   expires_at: Date;

//   @Column({ type: 'boolean', default: true })
//   is_valid: boolean;
// }
