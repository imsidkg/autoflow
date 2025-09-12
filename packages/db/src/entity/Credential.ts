import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import type { User } from './User.js'; // Add 'type'



@Entity('credentials')
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  type!: string;

  @Column('jsonb')
  data!: any;

  @ManyToOne('User', (user: User) => user.credentials)
user!: User;
}
