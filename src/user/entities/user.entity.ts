import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('utilisateur') // Correspond au nom exact de la table PostgreSQL
export class User {
  @PrimaryGeneratedColumn()
  id_user: number; // Correspond exactement à la colonne "id_user"

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
  date_inscription: Date; // ✅ On garde cette colonne car elle existe dans la BD
}
