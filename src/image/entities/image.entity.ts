import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id_image: string;

  @Column()
  url_image: string;

  @CreateDateColumn()
  date: Date;
}
