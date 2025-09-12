import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import type { Workflow } from './Workflow.js';
import type { Execution } from './Execution.js';
import type { Credential } from './Credential.js';



@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  passwordHash!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

    @OneToMany('Workflow', (workflow: Workflow) => workflow.owner)
  workflows!: Workflow[];

  @OneToMany('Execution', (execution: Execution) => execution.user)
  executions!: Execution[];

    @OneToMany('Credential', (credential: Credential) => credential.user)
  credentials!: Credential[];
}
