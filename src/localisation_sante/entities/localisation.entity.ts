import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('localisation')
export class Localisation {
  @PrimaryGeneratedColumn()
  id_localisation: number;

  @Column({ type: 'numeric', precision: 10, scale: 8 })
  longitude: number;

  @Column({ type: 'numeric', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'numeric', precision: 5, scale: 2, default: 10 })
  rayon: number;
}
