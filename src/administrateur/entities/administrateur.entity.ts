import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('administrateurs')
export class Administrateur {
  @PrimaryGeneratedColumn()
  id_admin_gestionnaire: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  telephone: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  mot_de_passe: string;

  @Column({ type: 'varchar', length: 50, nullable: false, default: 'admin' })
  role: string;

  @Column({ type: 'varchar', length: 20, nullable: true, default: 'actif' })
  statut: string;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  permissions: object;

  @Column({ type: 'timestamp', nullable: true })
  dernier_connexion: Date;

  @CreateDateColumn({ type: 'timestamp' })
  date_creation: Date;

  @CreateDateColumn({ type: 'timestamp' })
  date_modification: Date;

  @Column({ type: 'varchar', length: 255, nullable: true }) 
  nom_image?: string; 
}
