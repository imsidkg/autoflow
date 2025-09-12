import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import type { User } from './User.js';

@Entity('credentials')
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  type!: string;

  @Column()
  name!: string;

  @Column('jsonb')
  data!: any;

  @ManyToOne('User', (user: User) => user.credentials)
  user!: User;
}
